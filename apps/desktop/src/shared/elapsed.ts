import type { SessionResponse } from 'contracts'
import { differenceInSeconds } from 'date-fns'

export function elapsedSeconds(
	session: SessionResponse | null,
	now = new Date(),
): number {
	return session ? Math.max(0, differenceInSeconds(now, session.startedAt)) : 0
}

export function formatElapsed(seconds: number): string {
	const total = Math.max(0, Math.floor(seconds))
	return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
		.map((part) => String(part).padStart(2, '0'))
		.join(':')
}
