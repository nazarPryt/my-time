import { db } from '@db'
import { timeSessions } from '@db/schema'
import type { SessionType } from 'contracts'
import { and, asc, eq, gte, isNull, lt, lte } from 'drizzle-orm'

export const timeSessionsRepository = {
	// At most one open session per user is guaranteed by the partial unique
	// index idx_time_sessions_one_active_per_user, so a plain select is safe
	// here — no ordering/limit needed to pick "the" active one.
	getActive: async (userId: string) => {
		const [session] = await db
			.select()
			.from(timeSessions)
			.where(
				and(
					eq(timeSessions.userId, userId),
					isNull(timeSessions.endedAt),
					isNull(timeSessions.abandonedAt),
				),
			)
		return session ?? null
	},

	getTodaySessions: async (userId: string, start: Date, end: Date) => {
		return db
			.select()
			.from(timeSessions)
			.where(
				and(
					eq(timeSessions.userId, userId),
					gte(timeSessions.startedAt, start),
					lte(timeSessions.startedAt, end),
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
					gte(timeSessions.startedAt, start),
					lte(timeSessions.startedAt, end),
					isNull(timeSessions.abandonedAt),
				),
			)
			.orderBy(asc(timeSessions.startedAt))
	},

	// Returns null if the user already has an open session — the insert is
	// skipped by the partial unique index (idx_time_sessions_one_active_per_user)
	// instead of racing a separate getActive check against a separate insert.
	create: async (userId: string, type: SessionType, startedAt: Date) => {
		const [session] = await db
			.insert(timeSessions)
			.values({ userId, type, startedAt })
			.onConflictDoNothing({
				target: timeSessions.userId,
				where: and(
					isNull(timeSessions.endedAt),
					isNull(timeSessions.abandonedAt),
				),
			})
			.returning()
		return session ?? null
	},

	end: async (id: string, userId: string, endedAt: Date) => {
		const [session] = await db
			.update(timeSessions)
			.set({ endedAt })
			.where(
				and(
					eq(timeSessions.id, id),
					eq(timeSessions.userId, userId),
					isNull(timeSessions.endedAt),
					isNull(timeSessions.abandonedAt),
				),
			)
			.returning()
		return session ?? null
	},

	abandon: async (id: string, userId: string) => {
		const [session] = await db
			.update(timeSessions)
			.set({ abandonedAt: new Date() })
			.where(
				and(
					eq(timeSessions.id, id),
					eq(timeSessions.userId, userId),
					isNull(timeSessions.endedAt),
					isNull(timeSessions.abandonedAt),
				),
			)
			.returning()
		return session ?? null
	},

	abandonStale: async (userId: string, olderThan: Date) => {
		await db
			.update(timeSessions)
			.set({ abandonedAt: new Date() })
			.where(
				and(
					eq(timeSessions.userId, userId),
					isNull(timeSessions.endedAt),
					isNull(timeSessions.abandonedAt),
					lt(timeSessions.startedAt, olderThan),
				),
			)
	},
}
