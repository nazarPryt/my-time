import { describe, expect, test } from 'bun:test'
import { formatElapsed } from './format-elapsed'

describe('formatElapsed', () => {
	describe('under an hour (mm:ss)', () => {
		test.each([
			[0, '00:00'],
			[5, '00:05'],
			[59, '00:59'],
			[60, '01:00'],
			[61, '01:01'],
			[599, '09:59'],
			[600, '10:00'],
			[3599, '59:59'], // largest value still rendered without an hours part
		])('formats %i seconds as %s', (input, expected) => {
			expect(formatElapsed(input)).toBe(expected)
		})
	})

	describe('one hour and above (hh:mm:ss)', () => {
		test.each([
			[3600, '01:00:00'], // boundary: minutes/seconds roll into hours
			[3605, '01:00:05'],
			[3661, '01:01:01'],
			[36000, '10:00:00'],
			[359999, '99:59:59'],
			[360000, '100:00:00'], // hours are not truncated to two digits
		])('formats %i seconds as %s', (input, expected) => {
			expect(formatElapsed(input)).toBe(expected)
		})
	})

	describe('edge cases', () => {
		test('clamps negative input to zero', () => {
			expect(formatElapsed(-1)).toBe('00:00')
			expect(formatElapsed(-3661)).toBe('00:00')
		})

		test('zero-pads single-digit minutes and seconds', () => {
			expect(formatElapsed(65)).toBe('01:05')
		})
	})
})
