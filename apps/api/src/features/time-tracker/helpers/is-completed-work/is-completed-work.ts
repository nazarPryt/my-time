import type { SessionLike } from '../types'

export function isCompletedWork(s: SessionLike) {
	return s.type === 'work' && s.endedAt !== null && s.abandonedAt === null
}
