import { describe, expect, it } from 'bun:test'
import { subMinutes } from 'date-fns'
import { computeTodayStats } from './computeTodayStats'

describe('computeTodayStats', () => {
	it('returns zeroed stats for an empty list', () => {
		expect(computeTodayStats([])).toEqual({
			totalWorkSeconds: 0,
			sessionsCompleted: 0,
			longestSessionSeconds: 0,
		})
	})

	it('sums completed work seconds and tracks the longest session', () => {
		const now = new Date()
		const stats = computeTodayStats([
			{
				type: 'work',
				startedAt: subMinutes(now, 90),
				endedAt: subMinutes(now, 60),
				abandonedAt: null,
			}, // 30 min
			{
				type: 'work',
				startedAt: subMinutes(now, 50),
				endedAt: subMinutes(now, 10),
				abandonedAt: null,
			}, // 40 min
		])

		expect(stats.sessionsCompleted).toBe(2)
		expect(stats.totalWorkSeconds).toBe(30 * 60 + 40 * 60)
		expect(stats.longestSessionSeconds).toBe(40 * 60)
	})

	it('excludes abandoned and still-open sessions', () => {
		const now = new Date()
		const stats = computeTodayStats([
			{
				type: 'work',
				startedAt: subMinutes(now, 60),
				endedAt: subMinutes(now, 30),
				abandonedAt: subMinutes(now, 30),
			},
			{
				type: 'work',
				startedAt: subMinutes(now, 10),
				endedAt: null,
				abandonedAt: null,
			},
		])

		expect(stats).toEqual({
			totalWorkSeconds: 0,
			sessionsCompleted: 0,
			longestSessionSeconds: 0,
		})
	})
})
