import {
	addDays,
	format,
	isBefore,
	max,
	min,
	parseISO,
	startOfDay,
} from 'date-fns'
import { isCompletedWork } from '../isCompletedWork'
import { mergedWorkMilliseconds } from '../merged-work'
import type { DayStats, SessionLike } from '../types'

interface DayWork {
	sessions: SessionLike[]
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
			sessions: [],
			sessionsCompleted: 0,
		}
		byDay.set(key, {
			sessions: [...previous.sessions, session],
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
				totalWorkSeconds: Math.floor(
					mergedWorkMilliseconds(
						stats.sessions,
						max([parseISO(day), start ?? parseISO(day)]),
						min([addDays(parseISO(day), 1), end ?? addDays(parseISO(day), 1)]),
					) / 1000,
				),
				sessionsCompleted: stats.sessionsCompleted,
			},
		]),
	)
}
