import { expect, test } from '@playwright/test'
import {AUTH_ERRORS} from "contracts";

const API_ME = '**/api/v1/auth/me'

const MOCK_USER = {
	id: '1',
	email: 'test@example.com',
	name: 'Test User',
	timezone: null,
}

test('unauthenticated: / redirects to login', async ({ page }) => {
	await page.goto('/')
	await expect(page).toHaveURL('/auth/login')
})

test.describe('Dashboard home (authenticated)', () => {
	test.beforeEach(async ({ page }) => {
		await page.route(API_ME, (route) =>
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(MOCK_USER),
			}),
		)
	})

	test('renders dashboard home', async ({ page }) => {
		await page.goto('/dashboard')
		await expect(page.getByTestId('dashboard-home')).toBeVisible()
	})

	test('unauthenticated: /dashboard redirects to login', async ({ page }) => {
		await page.unroute(API_ME)
		await page.route(API_ME, (route) =>
			route.fulfill({
				status: 401,
				contentType: 'application/json',
				body: JSON.stringify(AUTH_ERRORS.UNAUTHORIZED.message),
			}),
		)
		await page.goto('/dashboard')
		await expect(page).toHaveURL('/auth/login')
	})
})