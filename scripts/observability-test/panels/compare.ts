import type { QueryResult } from '../grafana/client'
import type { Expectation } from './expectations'

/** Turns a panel's query results into what its expectation compares. */
export function reduce(results: QueryResult[], how: Expectation['reduce']) {
	const series = results.flatMap((result) => result.series)
	if (how === 'rows') return series.reduce((n, s) => n + s.rows, 0)
	if (how === 'last') return series[0]?.values.at(-1) ?? 0
	const totals: Record<string, number> = {}
	for (const s of series) {
		const key = s.labels[how.sumBy] ?? '(none)'
		totals[key] = (totals[key] ?? 0) + s.values.reduce((a, b) => a + b, 0)
	}
	return totals
}

const round = (n: number) => Math.round(n * 1000) / 1000

/** Undefined when they match, otherwise what the panel shows instead. */
export function compare(
	actual: number | Record<string, number>,
	expected: number | Record<string, number>,
): string | undefined {
	if (typeof expected === 'number') {
		const value = typeof actual === 'number' ? round(actual) : Number.NaN
		return value === expected
			? undefined
			: `shows ${value}, expected ${expected}`
	}
	const totals = typeof actual === 'number' ? {} : actual
	const wrong = Object.entries(expected)
		.filter(([key, n]) => round(totals[key] ?? 0) !== n)
		.map(([key, n]) => `${key}=${round(totals[key] ?? 0)} (expected ${n})`)
	return wrong.length ? `shows ${wrong.join(', ')}` : undefined
}
