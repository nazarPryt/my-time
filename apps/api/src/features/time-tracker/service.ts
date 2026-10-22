import type {
	SessionResponse,
	SessionType,
	TimerState,
	TodaySummaryResponse,
	WeeklySummaryResponse,
} from 'contracts'
import { SessionResponseSchema } from 'contracts'
import { addDays, startOfDay, subDays } from 'date-fns'
import {
	buildDayRange,
	computeCurrentStreak,
	groupCompletedWorkByDay,
	toSessionResponse,
} from './helpers'
import { timeSessionsRepository } from './repository'
import { buildTimerSnapshot, serverDay } from './timer-snapshot'
import { buildTodaySummary } from './today-summary'

const SUMMARY_DAYS = 30

export const timeTrackerService = {
	getActive: async (userId: string): Promise<SessionResponse | null> => {
		const session = await timeSessionsRepository.getActive(userId)
		return session ? toSessionResponse(session) : null
	},

	getToday: async (userId: string): Promise<TodaySummaryResponse> => {
		const now = new Date()
		const { start, end } = serverDay(now)
		const sessions = await timeSessionsRepository.getTodaySessions(
			userId,
			start,
			end,
		)
		return buildTodaySummary(sessions.map(toSessionResponse), now)
	},

	getTimer: async (userId: string): Promise<TimerState> => {
		const now = new Date()
		const { start } = serverDay(now)
		const { milliseconds, active } = await timeSessionsRepository.getTimer(
			userId,
			start,
			now,
		)
		const activeSession = active ? SessionResponseSchema.parse(active) : null
		return {
			activeSession,
			timer: buildTimerSnapshot(milliseconds, activeSession, now),
		}
	},

	startSession: async (
		userId: string,
		type: SessionType,
	): Promise<SessionResponse> => {
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
		const end = addDays(startOfDay(now), 1)

		const sessions = await timeSessionsRepository.getSessionsInRange(
			userId,
			start,
			end,
		)

		const byDay = groupCompletedWorkByDay(sessions, start, end)
		const days = buildDayRange(now, SUMMARY_DAYS, byDay)
		const currentStreakDays = computeCurrentStreak(days)

		return { days, currentStreakDays }
	},
}
