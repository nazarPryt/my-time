import type {
	SessionResponse,
	SessionType,
	TodaySummaryResponse,
	WeeklySummaryResponse,
} from 'contracts'
import { endOfDay, startOfDay, subDays, subHours } from 'date-fns'
import {
	buildDayRange,
	computeCurrentStreak,
	computeTodayStats,
	groupCompletedWorkByDay,
	toSessionResponse,
} from './helpers'
import { timeSessionsRepository } from './repository'

const STALE_THRESHOLD_HOURS = 2
const SUMMARY_DAYS = 30

export const timeTrackerService = {
	getActive: async (userId: string): Promise<SessionResponse | null> => {
		const session = await timeSessionsRepository.getActive(userId)
		return session ? toSessionResponse(session) : null
	},

	getToday: async (userId: string): Promise<TodaySummaryResponse> => {
		// TODO: day boundaries use the API server's local timezone, not the
		// user's — a session just after local midnight for a user ahead of the
		// server's TZ can land in "yesterday" here. Needs a user-supplied
		// timezone to fix properly; left as a follow-up.
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

		// A user can only have one open session at a time. create() is a
		// conditional insert (DB-enforced via a partial unique index) rather
		// than a separate check-then-insert, so concurrent/retried calls (e.g.
		// a double-click) can't both pass a check and create duplicate open
		// sessions — the loser's insert is skipped and it falls through to
		// fetching the session the winner created.
		const created = await timeSessionsRepository.create(
			userId,
			type,
			new Date(),
		)
		if (created) return toSessionResponse(created)

		const active = await timeSessionsRepository.getActive(userId)
		if (!active)
			throw new Error('startSession: no active session after conflict')
		return toSessionResponse(active)
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

		const byDay = groupCompletedWorkByDay(sessions)
		const days = buildDayRange(now, SUMMARY_DAYS, byDay)
		const currentStreakDays = computeCurrentStreak(days)

		return { days, currentStreakDays }
	},
}
