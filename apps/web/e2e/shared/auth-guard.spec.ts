import { AUTH_ERRORS } from '@my-time/contracts'
import { mockRefreshResponse } from '../auth/login/login.mocks'
import { LOGIN_PATH } from '../auth/login/login-page'
import { API_ME } from '../support/auth.mocks'
import { expect, test } from '../support/base.fixtures'

test.describe('Auth guard', () => {
	test('unauthenticated: / redirects to login', async ({ page }) => {
		await page.goto('/')
		await expect(page).toHaveURL(LOGIN_PATH)
	})

	test('unauthenticated: /dashboard redirects to login', async ({ page }) => {
		await page.route(API_ME, (route) =>
			route.fulfill({
				status: 401,
				contentType: 'application/json',
				body: JSON.stringify(AUTH_ERRORS.UNAUTHORIZED),
			}),
		)
		await mockRefreshResponse(page, 401)
		await page.goto('/dashboard')
		await expect(page).toHaveURL(LOGIN_PATH)
	})
})
