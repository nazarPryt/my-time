import { differenceInMilliseconds, max, min } from 'date-fns'
import type { SessionLike } from './types'

/** Only the intersection with [start, end) belongs to this day. */
export function workMilliseconds(
	session: SessionLike,
	start: Date,
	end: Date,
): number {
	if (session.type !== 'work' || session.abandonedAt) return 0
	const from = max([session.startedAt, start])
	const until = min([session.endedAt ?? end, end])
	return Math.max(0, differenceInMilliseconds(until, from))
}
