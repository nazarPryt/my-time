import { differenceInMilliseconds, isBefore, max, min } from 'date-fns'
import type { SessionLike } from './types'

/** Union of work ranges, clipped to server-owned accounting boundaries. */
export function mergedWorkMilliseconds(
	sessions: SessionLike[],
	start?: Date,
	end?: Date,
): number {
	const ranges = sessions
		.filter(
			(session) =>
				session.type === 'work' &&
				!session.abandonedAt &&
				(session.endedAt || end),
		)
		.map((session) => ({
			from: max([session.startedAt, start ?? session.startedAt]),
			until: min([
				session.endedAt ?? end ?? session.startedAt,
				end ?? session.endedAt ?? session.startedAt,
			]),
		}))
		.filter(({ from, until }) => isBefore(from, until))
		.sort((a, b) => differenceInMilliseconds(a.from, b.from))
	let total = 0
	let previous: { from: Date; until: Date } | undefined
	for (const range of ranges) {
		if (previous && !isBefore(previous.until, range.from))
			previous.until = max([previous.until, range.until])
		else {
			if (previous)
				total += differenceInMilliseconds(previous.until, previous.from)
			previous = range
		}
	}
	return (
		total +
		(previous ? differenceInMilliseconds(previous.until, previous.from) : 0)
	)
}
