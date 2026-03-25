import { db } from '@db'
import { timeSessions } from '@db/schema'
import type { SessionType } from 'contracts'
import { and, asc, eq, gte, isNull, lt, lte } from 'drizzle-orm'

export const timeSessionsRepository = {
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
			.limit(1)
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

	create: async (userId: string, type: SessionType, startedAt: Date) => {
		const [session] = await db
			.insert(timeSessions)
			.values({ userId, type, startedAt })
			.returning()
		return session
	},

	end: async (id: string, userId: string, endedAt: Date) => {
		const [session] = await db
			.update(timeSessions)
			.set({ endedAt })
			.where(and(eq(timeSessions.id, id), eq(timeSessions.userId, userId)))
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
