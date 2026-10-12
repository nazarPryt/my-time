import type { TodaySummaryResponse } from 'contracts'
import { isCompletedWork } from '../isCompletedWork'
import { mergedWorkMilliseconds } from '../merged-work'
import type { SessionLike } from '../types'
import { workMilliseconds } from '../work-duration'

export function computeTodayStats(
	sessions: SessionLike[],
	start?: Date,
	end?: Date,
): Omit<TodaySummaryResponse, 'sessions'> {
	const durations = sessions
		.filter(isCompletedWork)
		.map((session) =>
			workMilliseconds(
				session,
				start ?? session.startedAt,
				end ?? session.endedAt ?? session.startedAt,
			),
		)
	const totalMilliseconds = mergedWorkMilliseconds(
		sessions.filter(isCompletedWork),
		start,
		end,
	)

	return {
		totalWorkSeconds: Math.floor(totalMilliseconds / 1000),
		sessionsCompleted: durations.length,
		longestSessionSeconds: Math.floor(
			durations.reduce((longest, duration) => Math.max(longest, duration), 0) /
				1000,
		),
	}
}
