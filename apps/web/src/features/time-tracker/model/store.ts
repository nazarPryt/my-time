import { SessionSyncState } from '@my-time/session-sync'
import type { DailySummary, SessionResponse, TimerSnapshot } from 'contracts'
import { format } from 'date-fns'
import { create } from 'zustand'
import { fetchWeeklyProgress } from '../api/api'
import { createSessionCommands } from './session-commands'
import { createSummaryRefresh } from './summary-refresh'
import { createTimerPresentation } from './timer-presentation'
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
	const timer = createTimerPresentation(set, get)
	let refreshSummary = createSummaryRefresh(sync, applySummary)

	function applySummary(next: Partial<TimeTrackerState>): void {
		set(next)
		if (next.todaySummary?.timer) timer.accept(next.todaySummary.timer)
	}

	function confirmSession(
		activeSession: SessionResponse | null,
		snapshot?: TimerSnapshot,
	): void {
		set({ activeSession, loading: false, error: null })
		timer.confirm(snapshot)
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
		dailySeconds: null,
		error: null,
		weeklyData: [],
		weeklyLoading: true,

		beginSync: (lifetime) => {
			sync.reset()
			signal = lifetime
			// New owner, new queue: an old aborted request cannot drain this one.
			refreshSummary = createSummaryRefresh(sync, applySummary)
			timer.clear()
			set({
				desktopStatus: 'checking',
				activeSession: null,
				todaySummary: null,
				elapsed: 0,
				dailySeconds: null,
				loading: true,
				submitting: false,
				error: null,
			})
		},
		endSync: () => {
			timer.clear()
			set({
				desktopStatus: 'unknown',
				activeSession: null,
				todaySummary: null,
				dailySeconds: null,
				elapsed: 0,
			})
			sync.reset()
		},
		disconnectStream: () => {
			sync.disconnect()
			set({ desktopStatus: 'unknown' })
		},
		applySnapshot: (activeSession, timer) => {
			sync.receiveSnapshot()
			confirmSession(activeSession, timer)
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
