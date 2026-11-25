import { describe, expect, test } from 'bun:test'
import type { QueryResult } from '../grafana/client'
import { compare, reduce } from './compare'

const result = (
	...series: { labels?: Record<string, string>; values: number[] }[]
): QueryResult => ({
	series: series.map(({ labels = {}, values }) => ({
		labels,
		values,
		rows: values.length,
	})),
})

describe('reduce', () => {
	test('last takes the final value of the first series', () => {
		expect(reduce([result({ values: [1, 3] })], 'last')).toBe(3)
	})

	test('last of an empty panel is 0', () => {
		expect(reduce([result()], 'last')).toBe(0)
	})

	test('rows counts log lines across targets', () => {
		const logs = result({ values: [] }, { values: [] })
		logs.series[0].rows = 2
		logs.series[1].rows = 1
		expect(reduce([logs], 'rows')).toBe(3)
	})

	test('sumBy totals every bucket per label value', () => {
		const bars = result(
			{ labels: { event: 'login' }, values: [1, 0, 2] },
			{ labels: { event: 'register' }, values: [3] },
		)
		expect(reduce([bars], { sumBy: 'event' })).toEqual({
			login: 3,
			register: 3,
		})
	})
})

describe('compare', () => {
	test('matching numbers pass', () => {
		expect(compare(3, 3)).toBeUndefined()
	})

	test('float noise is rounded away', () => {
		expect(compare(2.9999999, 3)).toBeUndefined()
	})

	test('an extrapolated value fails', () => {
		expect(compare(3.087, 3)).toBe('shows 3.087, expected 3')
	})

	test('missing label values count as 0', () => {
		expect(compare({ web: 2 }, { web: 2, extension: 1 })).toBe(
			'shows extension=0 (expected 1)',
		)
	})
})
