import { expect, test } from '@playwright/test'
import { AUTH_ERRORS } from 'contracts'
import { API_ME } from '../support/auth.mocks'

test.describe('Auth guard', () => {
	test('unauthenticated: / redirects to login', async ({ page }) => {
		await page.goto('/')
		await expect(page).toHaveURL('/auth/login')
	})

	test('unauthenticated: /dashboard redirects to login', async ({ page }) => {
		await page.route(API_ME, (route) =>
			route.fulfill({
				status: 401,
				contentType: 'application/json',
				body: JSON.stringify(AUTH_ERRORS.UNAUTHORIZED),
			}),
		)
		await page.goto('/dashboard')
		await expect(page).toHaveURL('/auth/login')
	})
})
