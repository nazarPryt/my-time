import type {
	SessionResponse,
	TimerSnapshot,
	TodaySummaryResponse,
} from 'contracts'

export type TimeChartEntry = {
	date: string
	label: string
	hours: number
	totalWorkSeconds: number
}

export type DesktopStatus =
	| 'checking'
	| 'connected'
	| 'disconnected'
	| 'unknown'

export interface TimeTrackerState {
	desktopStatus: DesktopStatus
	applyDesktopPresence(connected: boolean): void
	activeSession: SessionResponse | null
	todaySummary: TodaySummaryResponse | null
	loading: boolean
	submitting: boolean
	elapsed: number
	dailySeconds: number | null
	error: string | null
	weeklyData: TimeChartEntry[]
	weeklyLoading: boolean
	applySnapshot(
		activeSession: SessionResponse | null,
		timer?: TimerSnapshot,
	): void
	beginSync(signal: AbortSignal): void
	endSync(): void
	disconnectStream(): void
	refreshSummary(signal?: AbortSignal): Promise<void>
	syncFailed(message: string): void
	startWork(): Promise<void>
	stopWork(): Promise<void>
	abandonSession(id: string): Promise<void>
	loadWeekly(signal?: AbortSignal): Promise<void>
}

export type SetTrackerState = (state: Partial<TimeTrackerState>) => void
