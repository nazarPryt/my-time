import {
	failTimeEvents,
	pushDesktopPresence,
	pushTimeSession,
	recoverTimeEvents,
	timeStreamStats,
} from './session-stream.mocks'
import { expect, test } from './time-tracker.fixtures'
import {
	API_TIME_END,
	API_TIME_TODAY,
	activeSessionStartedSecondsAgo,
	MOCK_SESSION_ACTIVE,
	MOCK_TODAY_EMPTY,
	MOCK_TODAY_WITH_SESSIONS,
	mockTimeActive,
	mockTimeToday,
} from './time-tracker.mocks'

// Exercises the browser against real streaming HTTP, with desktop/API events
// simulated by the stream helper. This does not launch GNOME Shell.
test.describe('Desktop synchronization regressions', () => {
	test('presence changes do not refresh history or interrupt a running timer', async ({
		page,
		timeTrackerPage,
	}) => {
		await page.clock.install()
		await mockTimeActive(page, activeSessionStartedSecondsAgo(125))
		let reads = 0
		page.on('request', (request) => {
			if (/\/time-tracker\/(active|today)$/.test(request.url())) reads++
		})
		await timeTrackerPage.goto()
		await expect(timeTrackerPage.statToday).toHaveText('2h')
		const before = reads
		const timer = await timeTrackerPage.timer.textContent()
		pushDesktopPresence(page, true)
		await expect(timeTrackerPage.desktopStatus).toHaveText(
			'Desktop connected · Synced',
		)
		pushDesktopPresence(page, false)
		await expect(timeTrackerPage.desktopStatus).toHaveText(
			'Desktop not connected',
		)
		await page.clock.runFor(2000)
		expect(reads).toBe(before)
		await expect(timeTrackerPage.statusBadge).toHaveText('Working')
		await expect(timeTrackerPage.timer).not.toHaveText(timer ?? '')
	})

	test('a delayed web Stop response cannot clear a newer desktop session', async ({
		page,
		timeTrackerPage,
	}) => {
		await mockTimeActive(page, MOCK_SESSION_ACTIVE)
		await timeTrackerPage.goto()
		let release!: () => void
		const held = new Promise<void>((resolve) => {
			release = resolve
		})
		await page.route(API_TIME_END, async (route) => {
			await held
			await route.fulfill({
				contentType: 'application/json',
				body: JSON.stringify({ ...MOCK_SESSION_ACTIVE, endedAt: new Date() }),
			})
		})
		const requested = page.waitForRequest(
			(request) =>
				request.method() === 'PATCH' && request.url().endsWith('/end'),
		)
		await timeTrackerPage.stop()
		await requested
		pushTimeSession(page, {
			...activeSessionStartedSecondsAgo(125),
			id: 'desktop-new-session',
		})
		await expect(timeTrackerPage.timer).toHaveText(/^02:/)
		release()
		await expect(timeTrackerPage.stopBtn).toBeEnabled()
		await expect(timeTrackerPage.statusBadge).toHaveText('Working')
		// Prove the next command targets the desktop session, not the old one.
		const nextStop = page.waitForRequest(
			(request) =>
				request.method() === 'PATCH' &&
				request.url().endsWith('/desktop-new-session/end'),
		)
		await timeTrackerPage.stop()
		await nextStop
	})

	test('offline Start discovers desktop work instead of creating a duplicate', async ({
		page,
		timeTrackerPage,
	}) => {
		await timeTrackerPage.goto()
		failTimeEvents(page)
		await expect(timeTrackerPage.error).toBeVisible()
		await mockTimeActive(page, activeSessionStartedSecondsAgo(125))
		let starts = 0
		page.on('request', (request) => {
			if (request.method() === 'POST' && request.url().endsWith('/start'))
				starts++
		})
		const activeRead = page.waitForRequest((request) =>
			request.url().endsWith('/time-tracker/active'),
		)
		await timeTrackerPage.start()
		await activeRead
		await expect(timeTrackerPage.stopBtn).toBeEnabled()
		await expect(timeTrackerPage.statusBadge).toHaveText('Working')
		expect(starts).toBe(0)
	})

	test('reconnect restores a desktop stop and completed history', async ({
		page,
		timeTrackerPage,
	}) => {
		await mockTimeActive(page, activeSessionStartedSecondsAgo(125))
		await mockTimeToday(page, MOCK_TODAY_EMPTY)
		await timeTrackerPage.goto()
		await expect(timeTrackerPage.statusBadge).toHaveText('Working')
		failTimeEvents(page)
		await expect(timeTrackerPage.error).toBeVisible()
		await mockTimeToday(page, MOCK_TODAY_WITH_SESSIONS)
		recoverTimeEvents(page, null)
		await expect(timeTrackerPage.statusBadge).toHaveText('Ready')
		await expect(timeTrackerPage.timer).toHaveText('00:00')
		await expect(timeTrackerPage.statSessions).toHaveText('2')
		await expect(timeTrackerPage.sessionRows).toHaveCount(3)
		await expect(timeTrackerPage.error).toBeHidden()
	})

	test('discards a delayed summary after a newer desktop event', async ({
		page,
		timeTrackerPage,
	}) => {
		await timeTrackerPage.goto()
		await expect(timeTrackerPage.statToday).toHaveText('2h')
		let release!: () => void
		const held = new Promise<void>((resolve) => {
			release = resolve
		})
		let reads = 0
		await page.route(API_TIME_TODAY, async (route) => {
			reads++
			if (reads === 1) {
				await held
				await route.fulfill({
					contentType: 'application/json',
					body: JSON.stringify(MOCK_TODAY_EMPTY),
				})
			} else {
				await route.fulfill({
					contentType: 'application/json',
					body: JSON.stringify(MOCK_TODAY_WITH_SESSIONS),
				})
			}
		})
		pushTimeSession(page, activeSessionStartedSecondsAgo(125))
		await expect.poll(() => reads).toBe(1)
		pushTimeSession(page, null)
		await expect(timeTrackerPage.statusBadge).toHaveText('Ready')
		release()
		await expect.poll(() => reads).toBe(2)
		await expect(timeTrackerPage.statToday).toHaveText('2h')
		await expect(timeTrackerPage.statSessions).toHaveText('2')
		await expect(timeTrackerPage.sessionRows).toHaveCount(3)
	})

	test('leaving closes the stream and returning owns exactly one connection', async ({
		page,
		timeTrackerPage,
	}) => {
		await timeTrackerPage.goto()
		await expect.poll(() => timeStreamStats(page).clients).toBe(1)
		await timeTrackerPage.navLink('settings').click()
		await expect(timeTrackerPage.timer).toHaveCount(0)
		await expect.poll(() => timeStreamStats(page).clients).toBe(0)
		pushTimeSession(page, activeSessionStartedSecondsAgo(125))
		await timeTrackerPage.navLink('time-tracker').click()
		await expect(timeTrackerPage.statusBadge).toHaveText('Working')
		await expect.poll(() => timeStreamStats(page).clients).toBe(1)
	})
})
