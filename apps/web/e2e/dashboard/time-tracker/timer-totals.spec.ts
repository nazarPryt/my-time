import type { TimerSnapshot } from 'contracts'
import { mockTimeEvents, pushTimeSession } from './session-stream.mocks'
import { expect, test } from './time-tracker.fixtures'
import {
	MOCK_SESSION_ACTIVE,
	MOCK_TODAY_EMPTY,
	mockTimeToday,
} from './time-tracker.mocks'

const timer: TimerSnapshot = {
	asOf: new Date('2026-10-12T23:59:55Z'),
	dayStartedAt: new Date('2026-10-12T00:00:00Z'),
	nextDayAt: new Date('2026-10-13T00:00:00Z'),
	timeZone: 'UTC',
	dailyWorkSeconds: 600,
	sessionWorkSeconds: 300,
	running: true,
}

test('local ticks cross server midnight without fetching totals each second', async ({
	page,
	timeTrackerPage,
}) => {
	await mockTimeToday(page, { ...MOCK_TODAY_EMPTY, sessionsCompleted: 1 })
	await mockTimeEvents(page, MOCK_SESSION_ACTIVE, timer)
	let reads = 0
	page.on('request', (request) => {
		if (request.url().endsWith('/time-tracker/today')) reads++
	})
	await timeTrackerPage.goto()
	await expect(timeTrackerPage.statToday).toHaveText('10m')
	// The timer comes from SSE; wait for the separate summary read to be applied.
	await expect(timeTrackerPage.statSessions).toHaveText('1')
	// Load timezone classes first, then control ticks without jumping the wall clock.
	await page.clock.install()
	await mockTimeToday(page, { ...MOCK_TODAY_EMPTY, sessionsCompleted: 2 })
	const refreshed = page.waitForResponse((response) =>
		response.url().endsWith('/time-tracker/today'),
	)
	pushTimeSession(page, MOCK_SESSION_ACTIVE, {
		...timer,
		sessionWorkSeconds: 400,
	})
	await refreshed
	await expect(timeTrackerPage.statSessions).toHaveText('2')
	await expect(timeTrackerPage.timer).toHaveText('06:40')
	const initialReads = reads
	await page.clock.runFor(10_000)
	await expect(timeTrackerPage.statToday).toHaveText('5s')
	await expect(timeTrackerPage.timer).toHaveText('06:50')
	expect(reads).toBe(initialReads)
})

test('stopping retains the server daily total while the session display returns to zero', async ({
	page,
	timeTrackerPage,
}) => {
	await page.clock.install()
	await mockTimeToday(page, MOCK_TODAY_EMPTY)
	await mockTimeEvents(page, MOCK_SESSION_ACTIVE, timer)
	await timeTrackerPage.goto()
	await expect(timeTrackerPage.statToday).toHaveText('10m')
	pushTimeSession(page, null, {
		...timer,
		running: false,
		sessionWorkSeconds: 0,
	})
	await expect(timeTrackerPage.statusBadge).toHaveText('Ready')
	await expect(timeTrackerPage.timer).toHaveText('00:00')
	await page.clock.runFor(2000)
	await expect(timeTrackerPage.statToday).toHaveText('10m')
})
