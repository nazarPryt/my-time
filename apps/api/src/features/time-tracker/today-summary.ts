import type { SessionResponse, TodaySummaryResponse } from 'contracts'
import { computeTodayStats } from './helpers'
import { workMilliseconds } from './helpers/work-duration'
import { buildTimerSnapshot, serverDay } from './timer-snapshot'

export function buildTodaySummary(
	sessions: SessionResponse[],
	now: Date,
): TodaySummaryResponse {
	const { start } = serverDay(now)
	const active =
		sessions.find((session) => !session.endedAt && !session.abandonedAt) ?? null
	const milliseconds = sessions.reduce(
		(total, session) => total + workMilliseconds(session, start, now),
		0,
	)
	return {
		sessions,
		...computeTodayStats(sessions, start, now),
		timer: buildTimerSnapshot(milliseconds, active, now),
	}
}
