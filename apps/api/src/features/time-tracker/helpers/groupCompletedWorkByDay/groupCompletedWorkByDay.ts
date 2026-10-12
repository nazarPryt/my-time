import { addDays, format, isBefore, max, min, startOfDay } from 'date-fns'
import { isCompletedWork } from '../isCompletedWork'
import type { DayStats, SessionLike } from '../types'
import { workMilliseconds } from '../work-duration'

interface DayWork {
	milliseconds: number
	sessionsCompleted: number
}

function addSessionDays(
	byDay: Map<string, DayWork>,
	session: SessionLike,
	start?: Date,
	end?: Date,
): void {
	if (!isCompletedWork(session) || !session.endedAt) return
	const from = max([session.startedAt, start ?? session.startedAt])
	const until = min([session.endedAt, end ?? session.endedAt])
	for (
		let day = startOfDay(from);
		isBefore(day, until);
		day = addDays(day, 1)
	) {
		const key = format(day, 'yyyy-MM-dd')
		const previous = byDay.get(key) ?? {
			milliseconds: 0,
			sessionsCompleted: 0,
		}
		byDay.set(key, {
			milliseconds:
				previous.milliseconds + workMilliseconds(session, day, addDays(day, 1)),
			sessionsCompleted: previous.sessionsCompleted + 1,
		})
	}
}

/** Completed sessions contribute to every server day they overlap. */
export function groupCompletedWorkByDay(
	sessions: SessionLike[],
	start?: Date,
	end?: Date,
): Map<string, DayStats> {
	const byDay = new Map<string, DayWork>()
	for (const session of sessions) addSessionDays(byDay, session, start, end)
	return new Map(
		Array.from(byDay, ([day, stats]) => [
			day,
			{
				totalWorkSeconds: Math.floor(stats.milliseconds / 1000),
				sessionsCompleted: stats.sessionsCompleted,
			},
		]),
	)
}
