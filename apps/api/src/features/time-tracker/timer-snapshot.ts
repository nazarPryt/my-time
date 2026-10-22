import type { SessionResponse, TimerSnapshot } from 'contracts'
import { addDays, differenceInMilliseconds, startOfDay } from 'date-fns'

export function serverDay(now: Date) {
	const start = startOfDay(now)
	return { start, end: addDays(start, 1) }
}

export function buildTimerSnapshot(
	dailyMilliseconds: number,
	active: SessionResponse | null,
	now: Date,
): TimerSnapshot {
	const { start, end } = serverDay(now)
	return {
		asOf: now,
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		dayStartedAt: start,
		nextDayAt: end,
		dailyWorkSeconds: dailyMilliseconds / 1000,
		sessionWorkSeconds: active
			? Math.max(0, differenceInMilliseconds(now, active.startedAt)) / 1000
			: 0,
		running: active !== null,
	}
}
