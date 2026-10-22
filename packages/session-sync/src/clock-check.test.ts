import { expect, spyOn, test } from 'bun:test'
import { createClockCheck } from './clock-check'

test('ordinary ticks do not refresh; clock changes and suspend request one reconciliation', () => {
	let wall = 0
	let monotonic = 0
	let changes = 0
	const check = createClockCheck(
		() => monotonic,
		() => {
			changes++
		},
		() => wall,
	)
	wall = monotonic = 1000
	check()
	expect(changes).toBe(0)
	wall += 3_600_000
	check()
	check()
	expect(changes).toBe(1)
	wall -= 3_600_000
	check()
	expect(changes).toBe(2)
})

test('replacing the wall clock keeps ordinary ticks aligned with the monotonic clock', () => {
	let monotonic = 0
	let changes = 0
	const originalNow = Date.now
	const initial = spyOn(Date, 'now').mockReturnValue(0)
	try {
		const check = createClockCheck(
			() => monotonic,
			() => changes++,
		)
		initial.mockRestore()
		const replacement = spyOn(Date, 'now').mockImplementation(() => monotonic)
		try {
			monotonic = 10_000
			check()
			expect(changes).toBe(0)
		} finally {
			replacement.mockRestore()
		}
	} finally {
		initial.mockRestore()
		Date.now = originalNow
	}
})
