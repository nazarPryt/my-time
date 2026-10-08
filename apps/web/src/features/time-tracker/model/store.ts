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
	error: string | null
	_intervalId: ReturnType<typeof setInterval> | null

	// weekly progress state
	weeklyData: TimeChartEntry[]
	weeklyLoading: boolean

	// actions
	load: (signal?: AbortSignal) => Promise<void>
	pauseTicking: () => void
	startWork: () => Promise<void>
	stopWork: () => Promise<void>
	abandonSession: (id: string) => Promise<void>
	loadWeekly: (signal?: AbortSignal) => Promise<void>
}

export const useTimeTrackerStore = create<TimeTrackerState>((set, get) => {
	let mutationVersion = 0
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
		error: null,
		_intervalId: null,

		weeklyData: [],
		weeklyLoading: true,

		load: async (signal) => {
			if (get().submitting || signal?.aborted) return
			const version = mutationVersion
			try {
				const [active, today] = await Promise.all([
					fetchActiveSession(signal),
					fetchTodaySummary(signal),
				])
				// A poll that began before a button action must not overwrite its result.
				if (signal?.aborted || version !== mutationVersion) return
				if (active.error || today.error) {
					set({
						loading: false,
						error:
							'Unable to refresh the timer. Your last confirmed session is still shown.',
					})
					return
				}
				const activeSession = active.data ?? null
				get().pauseTicking()
				set({
					activeSession,
					todaySummary: today.data ?? null,
					loading: false,
					error: null,
					elapsed: activeSession ? elapsedSince(activeSession.startedAt) : 0,
					_intervalId: activeSession ? startTicking() : null,
				})
			} catch {
				if (!signal?.aborted && version === mutationVersion) {
					set({
						loading: false,
						error: 'Unable to reach your API. Try again when connected.',
					})
				}
			}
		},

		pauseTicking: () => {
			const interval = get()._intervalId
			if (interval) clearInterval(interval)
			set({ _intervalId: null })
		},

		startWork: async () => {
			const { submitting } = get()
			if (submitting) return
			mutationVersion += 1
			set({ submitting: true, error: null })
			try {
				const { data, error } = await startSession('work')
				if (error || !data) {
					set({ error: 'Unable to start work. Please try again.' })
					return
				}
				set({
					activeSession: data,
					elapsed: elapsedSince(data.startedAt),
					_intervalId: startTicking(),
				})
			} catch {
				set({
					error: 'Unable to start work. Check your connection and try again.',
				})
			} finally {
				set({ submitting: false })
			}
		},

		stopWork: async () => {
			const { activeSession, submitting } = get()
			if (!activeSession || submitting) return
			mutationVersion += 1
			set({ submitting: true, error: null })
			try {
				const { error } = await endSession(activeSession.id)
				if (error) {
					set({
						error:
							'Unable to stop work. Your session is still active; please try again.',
					})
					return
				}
				get().pauseTicking()
				set({ activeSession: null, elapsed: 0 })
				const { data: today, error: summaryError } = await fetchTodaySummary()
				if (!summaryError && today) set({ todaySummary: today })
			} catch {
				set({
					error:
						'Unable to update the tracker. Check your connection and try again.',
				})
			} finally {
				set({ submitting: false })
			}
		},

		abandonSession: async (id: string) => {
			const { submitting } = get()
			if (submitting) return
			mutationVersion += 1
			set({ submitting: true, error: null })
			try {
				const { error } = await deleteSession(id)
				if (error) {
					set({ error: 'Unable to delete this session. Please try again.' })
					return
				}
				get().pauseTicking()
				set({ activeSession: null, elapsed: 0 })
				const { data: today, error: summaryError } = await fetchTodaySummary()
				if (!summaryError && today) set({ todaySummary: today })
			} catch {
				set({
					error:
						'Unable to delete this session. Check your connection and try again.',
				})
			} finally {
				set({ submitting: false })
			}
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
