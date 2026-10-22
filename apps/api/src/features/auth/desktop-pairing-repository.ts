import { db } from '@db'
import { desktopPairings, refreshTokens, users } from '@db/schema'
import type { DesktopPairingPoll } from 'contracts'
import { addSeconds, isBefore, subMinutes } from 'date-fns'
import { and, count, eq, gt, isNull, lt, sql } from 'drizzle-orm'
import type { SignedTokenPair } from './token'

const POLL_SECONDS = 5

export const desktopPairingRepository = {
	async create(data: typeof desktopPairings.$inferInsert) {
		return db.transaction(async (tx) => {
			// Coordinate the creation limit across API replicas without trusting proxy headers.
			await tx.execute(
				sql`select pg_advisory_xact_lock(hashtext(${data.requestKey}))`,
			)
			await tx
				.delete(desktopPairings)
				.where(lt(desktopPairings.expiresAt, data.createdAt))
			const [recent] = await tx
				.select({ count: count() })
				.from(desktopPairings)
				.where(
					and(
						eq(desktopPairings.requestKey, data.requestKey),
						gt(desktopPairings.createdAt, subMinutes(data.createdAt, 1)),
					),
				)
			if (recent.count >= 5) return null
			const [row] = await tx.insert(desktopPairings).values(data).returning()
			return row
		})
	},
	async info(requestId: string) {
		const [row] = await db
			.select({ confirmationCode: desktopPairings.confirmationCode })
			.from(desktopPairings)
			.where(
				and(
					eq(desktopPairings.id, requestId),
					gt(desktopPairings.expiresAt, new Date()),
					isNull(desktopPairings.userId),
				),
			)
		return row ?? null
	},
	async approve(requestId: string, userId: string): Promise<boolean> {
		const [row] = await db
			.update(desktopPairings)
			.set({ userId })
			.where(
				and(
					eq(desktopPairings.id, requestId),
					gt(desktopPairings.expiresAt, new Date()),
					isNull(desktopPairings.userId),
				),
			)
			.returning({ id: desktopPairings.id })
		return Boolean(row)
	},
	async poll(
		requestId: string,
		secretHash: string,
		issueTokens: (userId: string) => Promise<SignedTokenPair>,
	): Promise<DesktopPairingPoll> {
		return db.transaction(async (tx) => {
			const [row] = await tx
				.select()
				.from(desktopPairings)
				.where(
					and(
						eq(desktopPairings.id, requestId),
						eq(desktopPairings.secretHash, secretHash),
					),
				)
				.for('update')
			const now = new Date()
			if (!row || !isBefore(now, row.expiresAt)) return { status: 'expired' }
			if (isBefore(now, row.nextPollAt)) return { status: 'slow_down' }
			if (!row.userId) {
				await tx
					.update(desktopPairings)
					.set({ nextPollAt: addSeconds(now, POLL_SECONDS) })
					.where(eq(desktopPairings.id, row.id))
				return { status: 'pending' }
			}
			const [user] = await tx
				.select({ email: users.email })
				.from(users)
				.where(eq(users.id, row.userId))
			if (!user) return { status: 'expired' }
			// Token persistence and consumption commit together; retries cannot mint twice.
			const tokens = await issueTokens(row.userId)
			await tx.insert(refreshTokens).values({
				token: tokens.refreshToken,
				userId: row.userId,
				expiresAt: tokens.refreshExpiresAt,
			})
			await tx.delete(desktopPairings).where(eq(desktopPairings.id, row.id))
			return {
				status: 'connected',
				email: user.email,
				tokens: {
					accessToken: tokens.accessToken,
					refreshToken: tokens.refreshToken,
				},
			}
		})
	},
}
