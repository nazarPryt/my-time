import { differenceInSeconds, format } from 'date-fns'
import { isCompletedWork } from '../isCompletedWork'
import type { DayStats, SessionLike } from '../types'

const EMPTY_DAY_STATS: DayStats = { totalWorkSeconds: 0, sessionsCompleted: 0 }

/** Buckets completed work sessions by their `startedAt` day (yyyy-MM-dd). */
export function groupCompletedWorkByDay(
	sessions: SessionLike[],
): Map<string, DayStats> {
	const byDay = new Map<string, DayStats>()

	for (const s of sessions) {
		if (!isCompletedWork(s) || s.endedAt === null) continue
		const day = format(s.startedAt, 'yyyy-MM-dd')
		const dur = differenceInSeconds(s.endedAt, s.startedAt)
		const existing = byDay.get(day) ?? EMPTY_DAY_STATS
		byDay.set(day, {
			totalWorkSeconds: existing.totalWorkSeconds + dur,
			sessionsCompleted: existing.sessionsCompleted + 1,
		})
	}

	return byDay
}
