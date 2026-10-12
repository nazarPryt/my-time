import { ACCESS_TOKEN_KEY } from '@/shared/lib/token-storage'
import { LoginPage } from '../../auth/login/LoginPage'
import {
	API_REFRESH,
	MOCK_ACCESS_TOKEN,
	MOCK_LOGIN_SUCCESS,
	MOCK_REFRESHED_ACCESS_TOKEN,
	MOCK_UNAVAILABLE_ACCESS_TOKEN,
	mockAuthenticatedAccount,
	mockLoginResponse,
	mockRefreshResponse,
} from '../../auth/login/login.mocks'
import { MOCK_USER } from '../../support/auth.mocks'
import { DASHBOARD_PATH } from '../home/HomePage'
import { mockTimeTrackerWeekly } from '../home/home.mocks'
import { mockWorkoutProgress } from '../workout/workout.mocks'
import {
	expireTimeEvents,
	pushTimeSession,
	timeStreamStats,
} from './session-stream.mocks'
import { expect, test } from './time-tracker.fixtures'
import {
	API_TIME_TODAY,
	MOCK_SESSION_ACTIVE,
	MOCK_TODAY_WITH_SESSIONS,
} from './time-tracker.mocks'

test.describe('Credentials during live session synchronization', () => {
	test('refreshes on reconnect and continues receiving remote changes', async ({
		page,
		timeTrackerPage,
	}) => {
		await timeTrackerPage.goto()
		await expect(timeTrackerPage.statToday).toHaveText('2h')
		await mockRefreshResponse(page, 200)
		expireTimeEvents(page, MOCK_REFRESHED_ACCESS_TOKEN)
		await expect
			.poll(() => timeStreamStats(page).authorization)
			.toBe(`Bearer ${MOCK_REFRESHED_ACCESS_TOKEN}`)
		await expect.poll(() => timeStreamStats(page).clients).toBe(1)
		await expect(timeTrackerPage.error).toBeHidden()
		pushTimeSession(page, MOCK_SESSION_ACTIVE)
		await expect(timeTrackerPage.statusBadge).toHaveText('Working')
		expect(
			await page.evaluate((key) => localStorage.getItem(key), ACCESS_TOKEN_KEY),
		).toBe(MOCK_REFRESHED_ACCESS_TOKEN)
	})

	test('shares one refresh between a summary request and stream reconnect', async ({
		page,
		timeTrackerPage,
	}) => {
		await timeTrackerPage.goto()
		await expect(timeTrackerPage.statToday).toHaveText('2h')
		let release!: () => void
		const held = new Promise<void>((resolve) => {
			release = resolve
		})
		let refreshes = 0
		let rejectedSummary = 0
		await page.route(API_REFRESH, async (route) => {
			refreshes++
			await held
			await route.fulfill({
				contentType: 'application/json',
				body: JSON.stringify({
					tokens: { accessToken: MOCK_REFRESHED_ACCESS_TOKEN },
				}),
			})
		})
		await page.route(API_TIME_TODAY, (route) => {
			const authorized =
				route.request().headers().authorization ===
				`Bearer ${MOCK_REFRESHED_ACCESS_TOKEN}`
			if (!authorized) rejectedSummary++
			return route.fulfill({
				status: authorized ? 200 : 401,
				contentType: 'application/json',
				body: JSON.stringify(
					authorized ? MOCK_TODAY_WITH_SESSIONS : { code: 'UNAUTHORIZED' },
				),
			})
		})
		const streamRequestsBefore = timeStreamStats(page).requests
		pushTimeSession(page, MOCK_SESSION_ACTIVE)
		await expect.poll(() => rejectedSummary).toBe(1)
		expireTimeEvents(page, MOCK_REFRESHED_ACCESS_TOKEN)
		await expect
			.poll(() => timeStreamStats(page).requests)
			.toBeGreaterThan(streamRequestsBefore)
		expect(refreshes).toBe(1)
		release()
		await expect
			.poll(() => timeStreamStats(page).authorization)
			.toBe(`Bearer ${MOCK_REFRESHED_ACCESS_TOKEN}`)
		await expect.poll(() => timeStreamStats(page).clients).toBe(1)
		await expect(timeTrackerPage.error).toBeHidden()
		await expect(timeTrackerPage.statusBadge).toHaveText('Working')
		await expect(timeTrackerPage.statToday).toHaveText('2h')
		expect(refreshes).toBe(1)
	})

	test('stops retrying after refresh rejection and synchronizes again after re-login', async ({
		page,
		timeTrackerPage,
	}) => {
		await timeTrackerPage.goto()
		await expect(timeTrackerPage.statToday).toHaveText('2h')
		pushTimeSession(page, MOCK_SESSION_ACTIVE)
		await expect(timeTrackerPage.statusBadge).toHaveText('Working')
		await mockRefreshResponse(page, 401)
		expireTimeEvents(page, MOCK_UNAVAILABLE_ACCESS_TOKEN)
		await expect(timeTrackerPage.error).toHaveText(
			'Please sign in again to receive session updates.',
		)
		await expect(timeTrackerPage.statusBadge).toHaveText('Working')
		expect(
			await page.evaluate((key) => localStorage.getItem(key), ACCESS_TOKEN_KEY),
		).toBeNull()
		const attempts = timeStreamStats(page).requests
		await page.clock.install()
		await page.clock.runFor(30_000)
		expect(timeStreamStats(page).requests).toBe(attempts)
		await mockAuthenticatedAccount(page, MOCK_UNAVAILABLE_ACCESS_TOKEN)
		await mockRefreshResponse(page, 401)
		await mockLoginResponse(page, 200, MOCK_LOGIN_SUCCESS)
		await mockTimeTrackerWeekly(page)
		await mockWorkoutProgress(page)
		await page.goto(DASHBOARD_PATH)
		const login = new LoginPage(page)
		await expect(login.loginForm).toBeVisible()
		await mockAuthenticatedAccount(page)
		await login.fill(MOCK_USER.email, 'password123')
		expireTimeEvents(page, MOCK_ACCESS_TOKEN)
		await login.submit()
		await timeTrackerPage.navLink('time-tracker').click()
		await expect(timeTrackerPage.statusBadge).toHaveText('Working')
		await expect(timeTrackerPage.error).toBeHidden()
		await expect.poll(() => timeStreamStats(page).clients).toBe(1)
		pushTimeSession(page, null)
		await expect(timeTrackerPage.statusBadge).toHaveText('Ready')
	})
})
