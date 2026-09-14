import { describe, expect, it } from 'bun:test'
import { computeCurrentStreak } from './computeCurrentStreak'

describe('computeCurrentStreak', () => {
	it('returns 0 for an empty list', () => {
		expect(computeCurrentStreak([])).toBe(0)
	})

	it('returns 0 when the first (most recent) day has no completed session', () => {
		expect(
			computeCurrentStreak([
				{ sessionsCompleted: 0 },
				{ sessionsCompleted: 1 },
				{ sessionsCompleted: 1 },
			]),
		).toBe(0)
	})

	it('counts consecutive days from the start of the array', () => {
		expect(
			computeCurrentStreak([
				{ sessionsCompleted: 1 },
				{ sessionsCompleted: 2 },
				{ sessionsCompleted: 1 },
				{ sessionsCompleted: 0 },
				{ sessionsCompleted: 1 },
			]),
		).toBe(3)
	})

	it('stops counting at the first gap, ignoring runs further back', () => {
		expect(
			computeCurrentStreak([
				{ sessionsCompleted: 1 },
				{ sessionsCompleted: 0 },
				{ sessionsCompleted: 1 },
				{ sessionsCompleted: 1 },
			]),
		).toBe(1)
	})
})
