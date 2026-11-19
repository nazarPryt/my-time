import type { DailySummary } from 'contracts'
import { format, subDays } from 'date-fns'
import type { DayStats } from '../types'

const EMPTY_DAY_STATS: DayStats = { totalWorkSeconds: 0, sessionsCompleted: 0 }

/** Builds a `days`-length array of dates ending at `now`, most recent first. */
export function buildDayRange(
	now: Date,
	days: number,
	byDay: Map<string, DayStats>,
): DailySummary[] {
	return Array.from({ length: days }, (_, i) => {
		const day = subDays(now, i)
		const dateKey = format(day, 'yyyy-MM-dd')
		return { date: day, ...(byDay.get(dateKey) ?? EMPTY_DAY_STATS) }
	})
}
