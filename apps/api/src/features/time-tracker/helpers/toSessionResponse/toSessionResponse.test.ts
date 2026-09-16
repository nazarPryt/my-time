import { describe, expect, it } from 'bun:test'
import { toSessionResponse } from './toSessionResponse'

describe('toSessionResponse', () => {
	it('maps a DB session row to the wire shape', () => {
		const startedAt = new Date('2026-01-15T10:00:00.000Z')
		const endedAt = new Date('2026-01-15T10:30:00.000Z')

		expect(
			toSessionResponse({
				id: 'session-1',
				type: 'work',
				startedAt,
				endedAt,
				abandonedAt: null,
			}),
		).toEqual({
			id: 'session-1',
			type: 'work',
			startedAt,
			endedAt,
			abandonedAt: null,
		})
	})
})
