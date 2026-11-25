import {
	MOCK_ACCESS_TOKEN,
	mockAuthenticatedAccount,
	mockRefreshResponse,
} from '../auth/login/login.mocks'
import { LOGIN_PATH } from '../auth/login/login-page'
import { REGISTER_PATH } from '../auth/register/register-page'
import { mockTimeTrackerWeekly } from '../dashboard/home/home.mocks'
import { DASHBOARD_PATH, HomePage } from '../dashboard/home/home-page'
import { mockWorkoutProgress } from '../dashboard/workout/workout.mocks'
import { seedAccessToken } from '../support/access-token'
import { expect, test } from '../support/base.fixtures'
import { mockReleasesSeen } from '../support/releases.mocks'

const DASHBOARD_URL = new RegExp(`${DASHBOARD_PATH}?$`)

test.describe('Auth guard', () => {
	test('unauthenticated: / redirects to login', async ({ page }) => {
		await page.goto('/')
		await expect(page).toHaveURL(LOGIN_PATH)
	})

	test('unauthenticated: /dashboard redirects to login', async ({ page }) => {
		await mockAuthenticatedAccount(page)
		await mockRefreshResponse(page, 401)
		await page.goto(DASHBOARD_PATH)
		await expect(page).toHaveURL(LOGIN_PATH)
	})

	test.describe('authenticated', () => {
		test.beforeEach(async ({ page }) => {
			await seedAccessToken(page, MOCK_ACCESS_TOKEN)
			await mockAuthenticatedAccount(page)
			await mockTimeTrackerWeekly(page)
			await mockWorkoutProgress(page)
			await mockReleasesSeen(page)
		})

		for (const path of ['/', LOGIN_PATH, REGISTER_PATH] as const) {
			test(`${path} redirects to the dashboard`, async ({ page }) => {
				await page.goto(path)
				await expect(page).toHaveURL(DASHBOARD_URL)
				await expect(new HomePage(page).dashboardHome).toBeVisible()
			})
		}
	})
})
