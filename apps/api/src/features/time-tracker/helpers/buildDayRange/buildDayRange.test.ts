import { describe, expect, it } from 'bun:test'
import { format, subDays } from 'date-fns'
import { buildDayRange } from './buildDayRange'

describe('buildDayRange', () => {
	it('returns `days` entries, most recent first', () => {
		const now = new Date('2026-01-15T12:00:00.000Z')
		const range = buildDayRange(now, 3, new Map())

		expect(range).toHaveLength(3)
		expect(range.map((d) => format(d.date, 'yyyy-MM-dd'))).toEqual([
			format(now, 'yyyy-MM-dd'),
			format(subDays(now, 1), 'yyyy-MM-dd'),
			format(subDays(now, 2), 'yyyy-MM-dd'),
		])
	})

	it('fills days with no data with zeroed stats', () => {
		const now = new Date('2026-01-15T12:00:00.000Z')
		const range = buildDayRange(now, 1, new Map())

		expect(range[0]).toEqual({
			date: now,
			totalWorkSeconds: 0,
			sessionsCompleted: 0,
		})
	})

	it('fills in matching stats from byDay by date key', () => {
		const now = new Date('2026-01-15T12:00:00.000Z')
		const key = format(now, 'yyyy-MM-dd')
		const byDay = new Map([
			[key, { totalWorkSeconds: 1800, sessionsCompleted: 2 }],
		])

		const range = buildDayRange(now, 1, byDay)

		expect(range[0]).toEqual({
			date: now,
			totalWorkSeconds: 1800,
			sessionsCompleted: 2,
		})
	})
})
