import type { TodaySummaryResponse } from 'contracts'
import { differenceInSeconds } from 'date-fns'
import { isCompletedWork } from '../isCompletedWork'
import type { SessionLike } from '../types'

export function computeTodayStats(
	sessions: SessionLike[],
): Omit<TodaySummaryResponse, 'sessions'> {
	const completedWork = sessions.flatMap((s) =>
		isCompletedWork(s) ? [{ ...s, endedAt: s.endedAt as Date }] : [],
	)

	const totalWorkSeconds = completedWork.reduce((acc, s) => {
		return acc + differenceInSeconds(s.endedAt, s.startedAt)
	}, 0)

	const longestSessionSeconds = completedWork.reduce((max, s) => {
		const dur = differenceInSeconds(s.endedAt, s.startedAt)
		return dur > max ? dur : max
	}, 0)

	return {
		totalWorkSeconds,
		sessionsCompleted: completedWork.length,
		longestSessionSeconds,
	}
}
