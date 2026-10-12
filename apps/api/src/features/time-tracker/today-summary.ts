import type { SessionResponse, TodaySummaryResponse } from 'contracts'
import { computeTodayStats } from './helpers'
import { mergedWorkMilliseconds } from './helpers/merged-work'
import { buildTimerSnapshot, serverDay } from './timer-snapshot'

export function buildTodaySummary(
	sessions: SessionResponse[],
	now: Date,
): TodaySummaryResponse {
	const { start } = serverDay(now)
	const active =
		sessions.find((session) => !session.endedAt && !session.abandonedAt) ?? null
	const milliseconds = mergedWorkMilliseconds(sessions, start, now)
	return {
		sessions,
		...computeTodayStats(sessions, start, now),
		timer: buildTimerSnapshot(milliseconds, active, now),
	}
}
