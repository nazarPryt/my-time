import type {
	SessionResponse,
	SessionType,
	TodaySummaryResponse,
	WeeklySummaryResponse,
} from 'contracts'
import {
	differenceInSeconds,
	endOfDay,
	format,
	startOfDay,
	subDays,
	subHours,
} from 'date-fns'
import { timeSessionsRepository } from './repository'

const STALE_THRESHOLD_HOURS = 2
const SUMMARY_DAYS = 30
const EMPTY_DAY_STATS = { totalWorkSeconds: 0, sessionsCompleted: 0 }

function isCompletedWork(s: {
	type: string
	endedAt: Date | null
	abandonedAt: Date | null
}) {
	return s.type === 'work' && s.endedAt !== null && s.abandonedAt === null
}

function toSessionResponse(s: {
	id: string
	type: string
	startedAt: Date
	endedAt: Date | null
	abandonedAt: Date | null
}): SessionResponse {
	return {
		id: s.id,
		type: s.type as SessionType,
		startedAt: s.startedAt,
		endedAt: s.endedAt,
		abandonedAt: s.abandonedAt,
	}
}

function computeTodayStats(
	sessions: Array<{
		type: string
		startedAt: Date
		endedAt: Date | null
		abandonedAt: Date | null
	}>,
) {
	const completedWork = sessions.flatMap((s) =>
		isCompletedWork(s) ? [{ ...s, endedAt: s.endedAt as Date }] : [],
	)

	const totalWorkSeconds = completedWork.reduce((acc, s) => {
		return acc + differenceInSeconds(s.endedAt, s.startedAt)
	}, 0)

	const longestSessionSeconds = completedWork.reduce((max, s) => {
		const dur = differenceInSeconds(s.endedAt, s.startedAt)
		return dur > max ? dur : max
	}, 0)

	return {
		totalWorkSeconds,
		sessionsCompleted: completedWork.length,
		longestSessionSeconds,
	}
}

export const timeTrackerService = {
	getActive: async (userId: string): Promise<SessionResponse | null> => {
		const session = await timeSessionsRepository.getActive(userId)
		return session ? toSessionResponse(session) : null
	},

	getToday: async (userId: string): Promise<TodaySummaryResponse> => {
		const now = new Date()
		const sessions = await timeSessionsRepository.getTodaySessions(
			userId,
			startOfDay(now),
			endOfDay(now),
		)
		const stats = computeTodayStats(sessions)
		return {
			sessions: sessions.map(toSessionResponse),
			...stats,
		}
	},

	startSession: async (
		userId: string,
		type: SessionType,
	): Promise<SessionResponse> => {
		await timeSessionsRepository.abandonStale(
			userId,
			subHours(new Date(), STALE_THRESHOLD_HOURS),
		)

		const session = await timeSessionsRepository.create(
			userId,
			type,
			new Date(),
		)
		return toSessionResponse(session)
	},

	endSession: async (
		userId: string,
		sessionId: string,
	): Promise<SessionResponse | null> => {
		const session = await timeSessionsRepository.end(
			sessionId,
			userId,
			new Date(),
		)
		return session ? toSessionResponse(session) : null
	},

	abandonSession: async (
		userId: string,
		sessionId: string,
	): Promise<SessionResponse | null> => {
		const session = await timeSessionsRepository.abandon(sessionId, userId)
		return session ? toSessionResponse(session) : null
	},

	getWeeklySummary: async (userId: string): Promise<WeeklySummaryResponse> => {
		const now = new Date()
		const start = startOfDay(subDays(now, SUMMARY_DAYS - 1))
		const end = endOfDay(now)

		const sessions = await timeSessionsRepository.getSessionsInRange(
			userId,
			start,
			end,
		)

		const byDay = new Map<
			string,
			{ totalWorkSeconds: number; sessionsCompleted: number }
		>()

		for (const s of sessions) {
			if (!isCompletedWork(s) || s.endedAt === null) continue
			const day = format(s.startedAt, 'yyyy-MM-dd')
			const dur = differenceInSeconds(s.endedAt, s.startedAt)
			const existing = byDay.get(day) ?? EMPTY_DAY_STATS
			byDay.set(day, {
				totalWorkSeconds: existing.totalWorkSeconds + dur,
				sessionsCompleted: existing.sessionsCompleted + 1,
			})
		}

		// Build last N days array (most recent first)
		const days = Array.from({ length: SUMMARY_DAYS }, (_, i) => {
			const date = format(subDays(now, i), 'yyyy-MM-dd')
			return { date, ...(byDay.get(date) ?? EMPTY_DAY_STATS) }
		})

		// Consecutive days with >= 1 completed session, starting from today
		let currentStreakDays = 0
		for (const day of days) {
			if (day.sessionsCompleted > 0) {
				currentStreakDays++
			} else {
				break
			}
		}

		return { days, currentStreakDays }
	},
}
