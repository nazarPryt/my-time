import { describe, expect, it } from 'bun:test'
import { format, subDays, subMinutes } from 'date-fns'
import { groupCompletedWorkByDay } from './groupCompletedWorkByDay'

describe('groupCompletedWorkByDay', () => {
	it('returns an empty map for no sessions', () => {
		expect(groupCompletedWorkByDay([])).toEqual(new Map())
	})

	it('buckets multiple completed sessions on the same day together', () => {
		const now = new Date()
		const byDay = groupCompletedWorkByDay([
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

		const key = format(now, 'yyyy-MM-dd')
		expect(byDay.get(key)).toEqual({
			totalWorkSeconds: 30 * 60 + 40 * 60,
			sessionsCompleted: 2,
		})
	})

	it('keeps different days in separate buckets', () => {
		const today = new Date()
		const yesterday = subDays(today, 1)
		const byDay = groupCompletedWorkByDay([
			{
				type: 'work',
				startedAt: subMinutes(today, 60),
				endedAt: subMinutes(today, 30),
				abandonedAt: null,
			},
			{
				type: 'work',
				startedAt: subMinutes(yesterday, 60),
				endedAt: subMinutes(yesterday, 30),
				abandonedAt: null,
			},
		])

		expect(byDay.size).toBe(2)
	})

	it('ignores abandoned and still-open sessions', () => {
		const now = new Date()
		const byDay = groupCompletedWorkByDay([
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

		expect(byDay.size).toBe(0)
	})
})
