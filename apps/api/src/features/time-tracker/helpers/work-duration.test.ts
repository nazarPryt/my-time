import { expect, test } from 'bun:test'
import { computeTodayStats } from './computeTodayStats'
import { groupCompletedWorkByDay } from './groupCompletedWorkByDay'
import type { SessionLike } from './types'
import { workMilliseconds } from './work-duration'

function session(startedAt: string, endedAt: string | null): SessionLike {
	return {
		type: 'work',
		startedAt: new Date(startedAt),
		endedAt: endedAt ? new Date(endedAt) : null,
		abandonedAt: null,
	}
}

test('allocates a midnight crossing to each day, including active work', () => {
	const start = new Date('2026-10-13T00:00:00Z')
	const end = new Date('2026-10-13T00:05:00Z')
	const work = session('2026-10-12T23:50:00Z', '2026-10-13T00:05:00Z')
	expect(workMilliseconds(work, start, end)).toBe(300_000)
	expect(workMilliseconds({ ...work, endedAt: null }, start, end)).toBe(300_000)
	expect(computeTodayStats([work], start, end).totalWorkSeconds).toBe(300)
})

test('adds subsecond sessions before rounding the final total', () => {
	const work = [
		session('2026-10-12T10:00:00.000Z', '2026-10-12T10:00:00.600Z'),
		session('2026-10-12T10:01:00.000Z', '2026-10-12T10:01:00.600Z'),
	]
	expect(computeTodayStats(work).totalWorkSeconds).toBe(1)
})

test('excludes abandoned work and sessions ending exactly at day start', () => {
	const start = new Date('2026-10-13T00:00:00Z')
	const end = new Date('2026-10-13T00:05:00Z')
	const work = session('2026-10-12T23:50:00Z', '2026-10-13T00:00:00Z')
	expect(workMilliseconds(work, start, end)).toBe(0)
	expect(
		workMilliseconds({ ...work, endedAt: null, abandonedAt: end }, start, end),
	).toBe(0)
})

test('weekly accounting splits sessions at local server day boundaries', () => {
	// Local ISO inputs keep this test independent of the test runner timezone.
	const byDay = groupCompletedWorkByDay([
		session('2026-10-12T23:50:00', '2026-10-13T00:05:00'),
	])
	expect(byDay.get('2026-10-12')?.totalWorkSeconds).toBe(600)
	expect(byDay.get('2026-10-13')?.totalWorkSeconds).toBe(300)
})

test('backend accounting uses actual elapsed time for a 25-hour server day', () => {
	const start = new Date('2026-10-25T00:00:00+02:00')
	const end = new Date('2026-10-26T00:00:00+01:00')
	const work = session('2026-10-24T23:00:00+02:00', '2026-10-26T01:00:00+01:00')
	expect(workMilliseconds(work, start, end)).toBe(25 * 3600 * 1000)
})

test('weekly totals round integer milliseconds once across fractional sessions', () => {
	const byDay = groupCompletedWorkByDay([
		session('2026-10-12T10:00:00.000', '2026-10-12T10:00:00.300'),
		session('2026-10-12T10:01:00.000', '2026-10-12T10:01:00.600'),
		session('2026-10-12T10:02:00.000', '2026-10-12T10:02:00.100'),
	])
	expect(byDay.get('2026-10-12')?.totalWorkSeconds).toBe(1)
})
