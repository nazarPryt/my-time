import type { SessionResponse } from '@my-time/contracts'

export function toSessionResponse(s: SessionResponse): SessionResponse {
	return {
		id: s.id,
		type: s.type,
		startedAt: s.startedAt,
		endedAt: s.endedAt,
		abandonedAt: s.abandonedAt,
	}
}
