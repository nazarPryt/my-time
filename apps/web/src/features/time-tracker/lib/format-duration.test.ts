import { describe, expect, test } from 'bun:test'
import { formatDuration } from './format-duration'

describe('formatDuration', () => {
	describe('under a minute (seconds)', () => {
		test.each([
			[0, '0s'],
			[1, '1s'],
			[45, '45s'],
			[59, '59s'], // largest value still shown in seconds
		])('formats %i seconds as %s', (input, expected) => {
			expect(formatDuration(input)).toBe(expected)
		})
	})

	describe('one minute up to an hour (whole minutes)', () => {
		test.each([
			[60, '1m'], // boundary: seconds roll into a minute
			[61, '1m'], // sub-minute remainder is dropped
			[119, '1m'],
			[120, '2m'],
			[1800, '30m'],
			[3599, '59m'], // largest value still rendered without an hours part
		])('formats %i seconds as %s', (input, expected) => {
			expect(formatDuration(input)).toBe(expected)
		})
	})

	describe('one hour and above (hours + minutes)', () => {
		test.each([
			[3600, '1h'], // boundary: exactly one hour, zero minutes
			[3660, '1h 1m'],
			[3661, '1h 1m'], // sub-minute remainder is dropped
			[5400, '1h 30m'],
			[7200, '2h'], // whole hours omit the minutes part
			[7260, '2h 1m'],
			[36000, '10h'],
		])('formats %i seconds as %s', (input, expected) => {
			expect(formatDuration(input)).toBe(expected)
		})
	})
})
