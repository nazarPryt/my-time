import { expect, test } from 'bun:test'
import type { TimerSnapshot } from 'contracts'
import { TimerDisplay } from './timer-display'

const snapshot: TimerSnapshot = {
	asOf: new Date('2026-10-12T23:55:00Z'),
	timeZone: 'UTC',
	dayStartedAt: new Date('2026-10-12T00:00:00Z'),
	nextDayAt: new Date('2026-10-13T00:00:00Z'),
	dailyWorkSeconds: 600.75,
	sessionWorkSeconds: 300.25,
	running: true,
}

test('advances backend totals without using the client clock as server time', () => {
	const display = new TimerDisplay(snapshot, 10_000)
	expect(display.dailySeconds(15_000)).toBe(605)
	expect(display.sessionSeconds(15_000)).toBe(305)
})

test('daily total resets at server midnight; session continues', () => {
	const display = new TimerDisplay(snapshot, 0)
	expect(display.dailySeconds(300_000)).toBe(0)
	expect(display.dailySeconds(600_000)).toBe(300)
	expect(display.sessionSeconds(600_000)).toBe(900)
})

test('stopped work freezes and becomes zero on the next server day', () => {
	const display = new TimerDisplay({ ...snapshot, running: false }, 0)
	expect(display.dailySeconds(100_000)).toBe(600)
	expect(display.dailySeconds(600_000)).toBe(0)
	expect(display.sessionSeconds(100_000)).toBe(0)
})

test('offline multi-day rollover respects server timezone and daylight saving', () => {
	const display = new TimerDisplay(
		{
			...snapshot,
			asOf: new Date('2026-10-24T21:55:00Z'),
			timeZone: 'Europe/Rome',
			dayStartedAt: new Date('2026-10-23T22:00:00Z'),
			nextDayAt: new Date('2026-10-24T22:00:00Z'),
		},
		0,
	)
	// Fall-back day lasts 25 hours; 23:05 UTC is 00:05 on the following day.
	expect(display.dailySeconds(90_600_000)).toBe(300)
})
