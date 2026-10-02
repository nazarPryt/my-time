import { SHARED_TEST_IDS } from '@/shared/ui/testIds'
import type { TimeTrackerPage } from './TimeTrackerPage'
import { TIME_TRACKER_PATH } from './TimeTrackerPage'
import { expect, test } from './time-tracker.fixtures'
import {
	API_TIME_TODAY,
	activeSessionStartedSecondsAgo,
	MOCK_SESSION_ACTIVE,
	MOCK_TODAY_EMPTY,
	MOCK_TODAY_WITH_SESSIONS,
	mockTimeActive,
	mockTimeToday,
} from './time-tracker.mocks'

/** Parse the timer's `mm:ss` / `hh:mm:ss` text into total seconds. */
async function readTimerSeconds(timeTrackerPage: TimeTrackerPage) {
	const text = (await timeTrackerPage.timer.textContent()) ?? ''
	return text
		.split(':')
		.map(Number)
		.reduce((total, part) => total * 60 + part, 0)
}

test.describe('Time Tracker page', () => {
	test.describe('Loading state', () => {
		test('shows the loading placeholder until data resolves', async ({
			page,
			timeTrackerPage,
		}) => {
			// Delay /today so the loading branch stays mounted long enough to assert.
			await page.route(API_TIME_TODAY, async (route) => {
				await new Promise((resolve) => setTimeout(resolve, 400))
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify(MOCK_TODAY_WITH_SESSIONS),
				})
			})

			await page.goto(TIME_TRACKER_PATH)

			await expect(timeTrackerPage.loading).toBeVisible()
			await expect(timeTrackerPage.statusBadge).toBeVisible()
			await expect(timeTrackerPage.loading).toBeHidden()
		})
	})

	test.describe('Idle (Ready) state', () => {
		test.beforeEach(async ({ timeTrackerPage }) => {
			await timeTrackerPage.goto()
		})

		test('shows the Ready badge and a zeroed timer', async ({
			timeTrackerPage,
		}) => {
			await expect(timeTrackerPage.statusBadge).toHaveText('Ready')
			await expect(timeTrackerPage.timer).toHaveText('00:00')
		})

		test('shows Start and hides Stop/Delete controls', async ({
			timeTrackerPage,
		}) => {
			await expect(timeTrackerPage.startBtn).toBeVisible()
			await expect(timeTrackerPage.stopBtn).toBeHidden()
			await expect(timeTrackerPage.deleteTrigger).toBeHidden()
		})

		test("renders today's stat cards from the API summary", async ({
			timeTrackerPage,
		}) => {
			await expect(timeTrackerPage.statToday).toHaveText('2h')
			await expect(timeTrackerPage.statSessions).toHaveText('2')
			await expect(timeTrackerPage.statLongest).toHaveText('1h 30m')
		})

		test('lists every session for the day', async ({ timeTrackerPage }) => {
			await expect(timeTrackerPage.sessionList).toBeVisible()
			await expect(timeTrackerPage.sessionRows).toHaveCount(3)
		})

		test('shows durations for completed sessions', async ({
			timeTrackerPage,
		}) => {
			await expect(timeTrackerPage.sessionDuration(0)).toHaveText('30m')
			await expect(timeTrackerPage.sessionDuration(1)).toHaveText('1h 30m')
		})

		test('marks an abandoned session and shows no duration for it', async ({
			timeTrackerPage,
		}) => {
			await expect(timeTrackerPage.sessionAbandoned(2)).toBeVisible()
			await expect(timeTrackerPage.sessionDuration(2)).toHaveCount(0)
		})

		test('renders each session start time as HH:mm', async ({
			timeTrackerPage,
		}) => {
			await expect(timeTrackerPage.sessionTime(0)).toHaveText(/^\d{2}:\d{2}$/)
		})
	})

	test.describe('Empty state (no sessions today)', () => {
		// Request `timeTrackerPage` so the fixture's default mocks register first;
		// the override below then wins (Playwright resolves routes last-first).
		test.beforeEach(async ({ page, timeTrackerPage }) => {
			await mockTimeToday(page, MOCK_TODAY_EMPTY)
			await timeTrackerPage.goto()
		})

		test('shows zeroed stats and a dash for longest', async ({
			timeTrackerPage,
		}) => {
			await expect(timeTrackerPage.statToday).toHaveText('0s')
			await expect(timeTrackerPage.statSessions).toHaveText('0')
			await expect(timeTrackerPage.statLongest).toHaveText('—')
		})

		test('does not render the session list', async ({ timeTrackerPage }) => {
			await expect(timeTrackerPage.sessionList).toHaveCount(0)
		})
	})

	test.describe('Starting a session', () => {
		test.beforeEach(async ({ timeTrackerPage }) => {
			await timeTrackerPage.goto()
		})

		test('POSTs to /start and switches to the Working state', async ({
			page,
			timeTrackerPage,
		}) => {
			const startRequest = page.waitForRequest(
				(req) =>
					req.url().includes('/time-tracker/start') && req.method() === 'POST',
			)

			await timeTrackerPage.start()

			await startRequest
			await expect(timeTrackerPage.statusBadge).toHaveText('Working')
			await expect(timeTrackerPage.stopBtn).toBeVisible()
			await expect(timeTrackerPage.deleteTrigger).toBeVisible()
			await expect(timeTrackerPage.startBtn).toBeHidden()
		})
	})

	test.describe('Active session on load', () => {
		// `timeTrackerPage` is destructured in each test so the fixture's default
		// mocks register before the per-test override of /active.
		test('shows the Working state with Stop and Delete controls', async ({
			page,
			timeTrackerPage,
		}) => {
			await mockTimeActive(page, MOCK_SESSION_ACTIVE)
			await timeTrackerPage.goto()
			await expect(timeTrackerPage.statusBadge).toHaveText('Working')
			await expect(timeTrackerPage.stopBtn).toBeVisible()
			await expect(timeTrackerPage.deleteTrigger).toBeVisible()
			await expect(timeTrackerPage.startBtn).toBeHidden()
		})

		test('advances the elapsed timer while working', async ({
			page,
			timeTrackerPage,
		}) => {
			// Started ~5s ago; elapsed is derived from startedAt, so it opens near
			// 00:05 rather than 00:00, then keeps climbing once per second.
			await mockTimeActive(page, activeSessionStartedSecondsAgo(5))
			await timeTrackerPage.goto()

			const initial = await readTimerSeconds(timeTrackerPage)
			expect(initial).toBeGreaterThanOrEqual(5)

			// The store ticks once per second; the value must strictly increase.
			await expect
				.poll(() => readTimerSeconds(timeTrackerPage), { timeout: 3000 })
				.toBeGreaterThan(initial)
		})
	})

	test.describe('Elapsed timer persistence across navigation', () => {
		// Regression for the bug where the timer reset to 00:00 after leaving and
		// returning to the page: the widget remounts and re-runs load(), which used
		// to zero a from-zero counter. elapsed is now derived from startedAt, so it
		// must survive the remount.
		test('keeps the elapsed time after navigating away and back', async ({
			page,
			timeTrackerPage,
		}) => {
			// Started ~2 minutes ago so a reset-to-zero regression is unmistakable.
			await mockTimeActive(page, activeSessionStartedSecondsAgo(125))
			await timeTrackerPage.goto()

			const beforeNav = await readTimerSeconds(timeTrackerPage)
			expect(beforeNav).toBeGreaterThanOrEqual(125)

			// Leave for another tab — this unmounts the time-tracker widget.
			await timeTrackerPage.navLink('settings').click()
			await expect(timeTrackerPage.timer).toHaveCount(0)

			// Return — the widget remounts and load() runs again.
			await timeTrackerPage.navLink('time-tracker').click()
			await timeTrackerPage.statusBadge.waitFor({ state: 'visible' })

			// The timer must resume from the real elapsed time, never from 00:00.
			const afterNav = await readTimerSeconds(timeTrackerPage)
			expect(afterNav).toBeGreaterThanOrEqual(beforeNav)
		})
	})

	test.describe('Stopping a session', () => {
		test('PATCHes /end, returns to Ready, and refreshes the summary', async ({
			page,
			timeTrackerPage,
		}) => {
			await mockTimeActive(page, MOCK_SESSION_ACTIVE)
			await timeTrackerPage.goto()
			await expect(timeTrackerPage.statusBadge).toHaveText('Working')

			// After stopping, the store re-fetches /today and /active clears.
			await mockTimeActive(page, null)
			await mockTimeToday(page, MOCK_TODAY_EMPTY)

			const endRequest = page.waitForRequest(
				(req) =>
					req.url().includes('/time-tracker/') &&
					req.url().endsWith('/end') &&
					req.method() === 'PATCH',
			)

			await timeTrackerPage.stop()

			await endRequest
			await expect(timeTrackerPage.statusBadge).toHaveText('Ready')
			await expect(timeTrackerPage.startBtn).toBeVisible()
			await expect(timeTrackerPage.statToday).toHaveText('0s')
		})
	})

	test.describe('Deleting (abandoning) an active session', () => {
		test.beforeEach(async ({ page, timeTrackerPage }) => {
			await mockTimeActive(page, MOCK_SESSION_ACTIVE)
			await timeTrackerPage.goto()
			await expect(timeTrackerPage.statusBadge).toHaveText('Working')
		})

		test('opens a confirm dialog from the delete trigger', async ({
			timeTrackerPage,
		}) => {
			await timeTrackerPage.openDeleteDialog()
			await expect(timeTrackerPage.confirmDialog).toBeVisible()
		})

		test('cancelling keeps the session running', async ({
			timeTrackerPage,
		}) => {
			await timeTrackerPage.openDeleteDialog()
			await timeTrackerPage.confirmDialogCancelBtn.click()

			await expect(
				timeTrackerPage.page.getByTestId(SHARED_TEST_IDS.confirmDialog.root),
			).toHaveCount(0)
			await expect(timeTrackerPage.statusBadge).toHaveText('Working')
		})

		test('confirming DELETEs the session and returns to Ready', async ({
			page,
			timeTrackerPage,
		}) => {
			await mockTimeActive(page, null)
			await mockTimeToday(page, MOCK_TODAY_EMPTY)

			const deleteRequest = page.waitForRequest(
				(req) =>
					req.url().includes('/time-tracker/') && req.method() === 'DELETE',
			)

			await timeTrackerPage.confirmDelete()

			await deleteRequest
			await expect(timeTrackerPage.statusBadge).toHaveText('Ready')
			await expect(timeTrackerPage.startBtn).toBeVisible()
		})
	})
})
