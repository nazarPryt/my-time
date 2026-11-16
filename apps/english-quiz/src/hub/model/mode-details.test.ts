import { describe, expect, test } from 'bun:test'
import { describeMode, formatScore } from './mode-details'

describe('describeMode', () => {
	test('lists levels and duration', () => {
		expect(describeMode({ levels: 'A2–B2', minutes: 5 })).toEqual([
			{ kind: 'levels', text: 'A2–B2' },
			{ kind: 'duration', text: '~5 min' },
		])
	})

	test('adds the last score when there is one', () => {
		expect(
			describeMode({ levels: 'B1', minutes: 5 }, { correct: 6, total: 8 }).at(
				-1,
			),
		).toEqual({ kind: 'score', text: 'Last score 6/8' })
	})

	test('skips an empty level range', () => {
		expect(
			describeMode({ levels: '', minutes: 3 }).map((detail) => detail.kind),
		).toEqual(['duration'])
	})
})

describe('formatScore', () => {
	test('shows correct out of total', () => {
		expect(formatScore({ correct: 0, total: 8 })).toBe('0/8')
	})
})
