import type {
	DailySummary,
	SessionResponse,
	TodaySummaryResponse,
} from 'contracts'
import { differenceInSeconds, format } from 'date-fns'
import { create } from 'zustand'
import {
	deleteSession,
	endSession,
	fetchActiveSession,
	fetchTodaySummary,
	fetchWeeklyProgress,
	startSession,
} from '../api/api'

export type TimeChartEntry = {
	date: string
	label: string
	hours: number
	totalWorkSeconds: number
}

/**
 * Elapsed seconds since a session began, derived from its start timestamp.
 * Computing from `startedAt` (instead of a from-zero counter) keeps the timer
 * correct across remounts/navigation and clock drift. Clamped at 0 to guard
 * against minor client/server clock skew producing a negative value.
 */
function elapsedSince(startedAt: Date): number {
	return Math.max(0, differenceInSeconds(new Date(), startedAt))
}

function toChartEntry(d: DailySummary): TimeChartEntry {
	return {
		date: format(d.date, 'yyyy-MM-dd'),
		label: format(d.date, 'MMM d'),
		hours: +(d.totalWorkSeconds / 3600).toFixed(2),
		totalWorkSeconds: d.totalWorkSeconds,
	}
}

interface TimeTrackerState {
	// session state
	activeSession: SessionResponse | null
	todaySummary: TodaySummaryResponse | null
	loading: boolean
	submitting: boolean
	elapsed: number
	_intervalId: ReturnType<typeof setInterval> | null

	// weekly progress state
	weeklyData: TimeChartEntry[]
	weeklyLoading: boolean

	// actions
	load: (signal?: AbortSignal) => Promise<void>
	startWork: () => Promise<void>
	stopWork: () => Promise<void>
	abandonSession: (id: string) => Promise<void>
	loadWeekly: (signal?: AbortSignal) => Promise<void>
}

export const useTimeTrackerStore = create<TimeTrackerState>((set, get) => {
	/**
	 * Clears any running interval and, for an active session, starts a 1s tick
	 * that recomputes `elapsed` from the session's `startedAt`. Returns the new
	 * interval id (null when there is no active session) to store in state.
	 */
	function startTicking(): ReturnType<typeof setInterval> {
		const existing = get()._intervalId
		if (existing) clearInterval(existing)
		return setInterval(() => {
			set((s) =>
				s.activeSession
					? { elapsed: elapsedSince(s.activeSession.startedAt) }
					: { elapsed: 0, _intervalId: null },
			)
		}, 1000)
	}

	return {
		activeSession: null,
		todaySummary: null,
		loading: true,
		submitting: false,
		elapsed: 0,
		_intervalId: null,

		weeklyData: [],
		weeklyLoading: true,

		load: async (signal) => {
			const [{ data: active }, { data: today }] = await Promise.all([
				fetchActiveSession(),
				fetchTodaySummary(signal),
			])
			if (signal?.aborted) return

			const activeSession = active ?? null

			// Start or clear the tick interval based on whether there is an active
			// session. elapsed is derived from startedAt so it reflects real time
			// already spent, not time since this component mounted.
			const existing = get()._intervalId
			if (existing) clearInterval(existing)

			set({
				activeSession,
				todaySummary: today ?? null,
				loading: false,
				elapsed: activeSession ? elapsedSince(activeSession.startedAt) : 0,
				_intervalId: activeSession ? startTicking() : null,
			})
		},

		startWork: async () => {
			const { submitting } = get()
			if (submitting) return
			set({ submitting: true })

			const { data, error } = await startSession('work')
			if (!error && data) {
				set({
					activeSession: data,
					elapsed: elapsedSince(data.startedAt),
					_intervalId: startTicking(),
				})
			}
			set({ submitting: false })
		},

		stopWork: async () => {
			const { activeSession, submitting } = get()
			if (!activeSession || submitting) return
			set({ submitting: true })

			await endSession(activeSession.id)

			const existing = get()._intervalId
			if (existing) clearInterval(existing)

			const { data: today } = await fetchTodaySummary()
			set({
				activeSession: null,
				todaySummary: today ?? null,
				elapsed: 0,
				_intervalId: null,
				submitting: false,
			})
		},

		abandonSession: async (id: string) => {
			const { submitting } = get()
			if (submitting) return
			set({ submitting: true })

			await deleteSession(id)

			const existing = get()._intervalId
			if (existing) clearInterval(existing)

			const { data: today } = await fetchTodaySummary()
			set({
				activeSession: null,
				todaySummary: today ?? null,
				elapsed: 0,
				_intervalId: null,
				submitting: false,
			})
		},

		loadWeekly: async (signal) => {
			set({ weeklyLoading: true })
			const { data } = await fetchWeeklyProgress(signal)
			if (signal?.aborted) return
			if (!data) {
				set({ weeklyLoading: false })
				return
			}
			// API returns most-recent-first; reverse for chronological display
			const sorted = [...data.days].reverse()
			set({ weeklyData: sorted.map(toChartEntry), weeklyLoading: false })
		},
	}
})
