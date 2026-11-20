import { describe, expect, test } from 'bun:test'
import { formatLevelRange } from './format-level-range'

describe('formatLevelRange', () => {
	test('joins the first and last level with an en dash', () => {
		expect(formatLevelRange(['A2', 'B1', 'B2'])).toBe('A2–B2')
	})

	test('shows a single level as is', () => {
		expect(formatLevelRange(['B1'])).toBe('B1')
	})

	test('returns an empty string for no levels', () => {
		expect(formatLevelRange([])).toBe('')
	})
})
