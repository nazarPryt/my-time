import { db } from '@db'
import { desktopPresence } from '@db/schema'
import { addSeconds, min } from 'date-fns'
import { and, desc, eq, gt, lt, sql } from 'drizzle-orm'

export const DESKTOP_PRESENCE_CHANNEL = 'desktop_presence_changed'
function leaseExpiry(tokenExpiry: number) {
	return min([addSeconds(new Date(), 60), new Date(tokenExpiry)])
}

export const desktopPresenceRepository = {
	async register(
		id: string,
		userId: string,
		tokenExpiry: number,
	): Promise<void> {
		await db.transaction(async (tx) => {
			await tx
				.delete(desktopPresence)
				.where(lt(desktopPresence.expiresAt, new Date()))
			await tx
				.insert(desktopPresence)
				.values({ id, userId, expiresAt: leaseExpiry(tokenExpiry) })
			await tx.execute(
				sql`select pg_notify(${DESKTOP_PRESENCE_CHANNEL}, ${userId})`,
			)
		})
	},
	async renew(id: string, tokenExpiry: number): Promise<void> {
		await db
			.update(desktopPresence)
			.set({ expiresAt: leaseExpiry(tokenExpiry) })
			.where(eq(desktopPresence.id, id))
	},
	async release(id: string, userId: string): Promise<void> {
		await db.transaction(async (tx) => {
			const rows = await tx
				.delete(desktopPresence)
				.where(
					and(eq(desktopPresence.id, id), eq(desktopPresence.userId, userId)),
				)
				.returning({ id: desktopPresence.id })
			if (rows.length)
				await tx.execute(
					sql`select pg_notify(${DESKTOP_PRESENCE_CHANNEL}, ${userId})`,
				)
		})
	},
	async snapshot(userId: string): Promise<Date | null> {
		const [row] = await db
			.select({ expiresAt: desktopPresence.expiresAt })
			.from(desktopPresence)
			.where(
				and(
					eq(desktopPresence.userId, userId),
					gt(desktopPresence.expiresAt, new Date()),
				),
			)
			.orderBy(desc(desktopPresence.expiresAt))
			.limit(1)
		return row?.expiresAt ?? null
	},
}
