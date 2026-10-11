import { SessionSyncState } from '@my-time/session-sync'
import type { DailySummary, SessionResponse } from 'contracts'
import { differenceInSeconds, format } from 'date-fns'
import { create } from 'zustand'
import { fetchWeeklyProgress } from '../api/api'
import { createSessionCommands } from './session-commands'
import { createSummaryRefresh } from './summary-refresh'
import type { TimeChartEntry, TimeTrackerState } from './types'

export type { TimeChartEntry } from './types'

function toChartEntry(day: DailySummary): TimeChartEntry {
	return {
		date: format(day.date, 'yyyy-MM-dd'),
		label: format(day.date, 'MMM d'),
		hours: +(day.totalWorkSeconds / 3600).toFixed(2),
		totalWorkSeconds: day.totalWorkSeconds,
	}
}

export const useTimeTrackerStore = create<TimeTrackerState>((set, get) => {
	const sync = new SessionSyncState()
	let signal: AbortSignal | undefined
	let tick: ReturnType<typeof setInterval> | undefined
	let refreshSummary = createSummaryRefresh(sync, set)

	function pauseTicking(): void {
		clearInterval(tick)
		tick = undefined
	}

	function confirmSession(activeSession: SessionResponse | null): void {
		pauseTicking()
		function updateElapsed(): void {
			set({
				elapsed: activeSession
					? Math.max(
							0,
							differenceInSeconds(new Date(), activeSession.startedAt),
						)
					: 0,
			})
		}
		set({ activeSession, loading: false, error: null })
		updateElapsed()
		if (activeSession) tick = setInterval(updateElapsed, 1000)
	}

	return {
		desktopStatus: 'checking',
		applyDesktopPresence: (connected) =>
			set({ desktopStatus: connected ? 'connected' : 'disconnected' }),
		activeSession: null,
		todaySummary: null,
		loading: true,
		submitting: false,
		elapsed: 0,
		error: null,
		weeklyData: [],
		weeklyLoading: true,

		beginSync: (lifetime) => {
			sync.reset()
			signal = lifetime
			// New owner, new queue: an old aborted request cannot drain this one.
			refreshSummary = createSummaryRefresh(sync, set)
			pauseTicking()
			set({
				desktopStatus: 'checking',
				activeSession: null,
				todaySummary: null,
				elapsed: 0,
				loading: true,
				submitting: false,
				error: null,
			})
		},
		endSync: () => {
			set({ desktopStatus: 'unknown' })
			sync.reset()
			pauseTicking()
		},
		disconnectStream: () => {
			sync.disconnect()
			set({ desktopStatus: 'unknown' })
		},
		applySnapshot: (activeSession) => {
			sync.receiveSnapshot()
			confirmSession(activeSession)
		},
		refreshSummary: (requestSignal) => refreshSummary(requestSignal ?? signal),
		syncFailed: (message) => set({ loading: false, error: message }),
		...createSessionCommands(set, get, sync, confirmSession),

		loadWeekly: async (requestSignal) => {
			set({ weeklyLoading: true })
			try {
				const { data } = await fetchWeeklyProgress(requestSignal)
				if (requestSignal?.aborted) return
				set({
					weeklyData: data
						? [...data.days].reverse().map(toChartEntry)
						: get().weeklyData,
					weeklyLoading: false,
				})
			} catch {
				if (!requestSignal?.aborted) set({ weeklyLoading: false })
			}
		},
	}
})
