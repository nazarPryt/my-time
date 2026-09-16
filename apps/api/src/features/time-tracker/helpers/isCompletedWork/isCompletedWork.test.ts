import { describe, expect, it } from 'bun:test'
import type { SessionLike } from '../types'
import { isCompletedWork } from './isCompletedWork'

const BASE: SessionLike = {
	type: 'work',
	startedAt: new Date(),
	endedAt: null,
	abandonedAt: null,
}

describe('isCompletedWork', () => {
	it('is true for a work session that has ended and was not abandoned', () => {
		expect(isCompletedWork({ ...BASE, endedAt: new Date() })).toBe(true)
	})

	it('is false for a session that has not ended yet', () => {
		expect(isCompletedWork({ ...BASE, endedAt: null })).toBe(false)
	})

	it('is false for a session that was abandoned, even if it has an endedAt', () => {
		expect(
			isCompletedWork({
				...BASE,
				endedAt: new Date(),
				abandonedAt: new Date(),
			}),
		).toBe(false)
	})

	it('is false for a non-work session type', () => {
		// Cast: contracts' SessionType is currently `'work'` only, but this
		// guards the comparison staying correct if more types are ever added.
		expect(
			isCompletedWork({
				...BASE,
				type: 'break',
				endedAt: new Date(),
			} as unknown as SessionLike),
		).toBe(false)
	})
})
