import type {
	DailySummary,
	SessionResponse,
	TodaySummaryResponse,
} from 'contracts'
import { format } from 'date-fns'
import { create } from 'zustand'
import {
	deleteSession,
	endSession,
	fetchActiveSession,
	fetchTodaySummary,
	fetchWeeklyProgress,
	startSession,
} from './api'

export type TimeChartEntry = {
	date: string
	label: string
	hours: number
	totalWorkSeconds: number
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

export const useTimeTrackerStore = create<TimeTrackerState>((set, get) => ({
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

		// Start or clear the tick interval based on whether there is an active session
		const existing = get()._intervalId
		if (existing) clearInterval(existing)

		let intervalId: ReturnType<typeof setInterval> | null = null
		if (activeSession) {
			intervalId = setInterval(() => {
				set((s) =>
					s.activeSession
						? { elapsed: s.elapsed + 1 }
						: { elapsed: 0, _intervalId: null },
				)
			}, 1000)
		}

		set({
			activeSession,
			todaySummary: today ?? null,
			loading: false,
			elapsed: 0,
			_intervalId: intervalId,
		})
	},

	startWork: async () => {
		const { submitting } = get()
		if (submitting) return
		set({ submitting: true })

		const { data, error } = await startSession('work')
		if (!error && data) {
			// Start ticking
			const existing = get()._intervalId
			if (existing) clearInterval(existing)
			const intervalId = setInterval(() => {
				set((s) =>
					s.activeSession
						? { elapsed: s.elapsed + 1 }
						: { elapsed: 0, _intervalId: null },
				)
			}, 1000)
			set({ activeSession: data, elapsed: 0, _intervalId: intervalId })
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
}))
