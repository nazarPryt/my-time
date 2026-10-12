import { db } from '@db'
import { timeSessions } from '@db/schema'
import type { SessionType } from 'contracts'
import { and, asc, eq, gt, isNull, lt, lte, or } from 'drizzle-orm'
import { mutateSessions } from './session-notifications'
import { activeRecord, dailyMilliseconds } from './timer-query'

const openSession = and(
	isNull(timeSessions.endedAt),
	isNull(timeSessions.abandonedAt),
)

export const timeSessionsRepository = {
	// At most one open session per user is guaranteed by the partial unique
	// index idx_time_sessions_one_active_per_user, so a plain select is safe
	// here — no ordering/limit needed to pick "the" active one.
	getActive: async (userId: string) => {
		const [session] = await db
			.select()
			.from(timeSessions)
			.where(and(eq(timeSessions.userId, userId), openSession))
		return session ?? null
	},

	getTodaySessions: async (userId: string, start: Date, end: Date) => {
		return db
			.select()
			.from(timeSessions)
			.where(
				and(
					eq(timeSessions.userId, userId),
					lt(timeSessions.startedAt, end),
					or(
						gt(timeSessions.endedAt, start),
						gt(timeSessions.abandonedAt, start),
						openSession,
					),
				),
			)
			.orderBy(asc(timeSessions.startedAt))
	},

	getSessionsInRange: async (userId: string, start: Date, end: Date) => {
		return db
			.select()
			.from(timeSessions)
			.where(
				and(
					eq(timeSessions.userId, userId),
					lt(timeSessions.startedAt, end),
					or(gt(timeSessions.endedAt, start), openSession),
					isNull(timeSessions.abandonedAt),
				),
			)
			.orderBy(asc(timeSessions.startedAt))
	},

	/** One statement observes the active session and total in the same DB snapshot. */
	getTimer: async (userId: string, start: Date, now: Date) => {
		const [row] = await db
			.select({
				milliseconds: dailyMilliseconds(start, now),
				active: activeRecord(),
			})
			.from(timeSessions)
			.where(
				and(
					eq(timeSessions.userId, userId),
					isNull(timeSessions.abandonedAt),
					lte(timeSessions.startedAt, now),
					or(gt(timeSessions.endedAt, start), openSession),
				),
			)
		return { milliseconds: row?.milliseconds ?? 0, active: row?.active ?? null }
	},

	// Returns null if the user already has an open session — the insert is
	// skipped by the partial unique index (idx_time_sessions_one_active_per_user)
	// instead of racing a separate getActive check against a separate insert.
	create: async (userId: string, type: SessionType, startedAt: Date) => {
		const [session] = await mutateSessions(userId, async (transaction) =>
			transaction
				.insert(timeSessions)
				.values({ userId, type, startedAt })
				.onConflictDoNothing({
					target: timeSessions.userId,
					where: openSession,
				})
				.returning(),
		)
		return session ?? null
	},

	end: async (id: string, userId: string, endedAt: Date) => {
		const [session] = await mutateSessions(userId, async (transaction) =>
			transaction
				.update(timeSessions)
				.set({ endedAt })
				.where(
					and(
						eq(timeSessions.id, id),
						eq(timeSessions.userId, userId),
						openSession,
					),
				)
				.returning(),
		)
		return session ?? null
	},

	abandon: async (id: string, userId: string) => {
		const [session] = await mutateSessions(userId, async (transaction) =>
			transaction
				.update(timeSessions)
				.set({ abandonedAt: new Date() })
				.where(
					and(
						eq(timeSessions.id, id),
						eq(timeSessions.userId, userId),
						openSession,
					),
				)
				.returning(),
		)
		return session ?? null
	},
}
