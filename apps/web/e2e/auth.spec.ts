import { expect, test } from '@playwright/test'

test.describe('Login page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/auth/login')
	})

	test('shows login form', async ({ page }) => {
		await expect(page.getByTestId('login-form')).toBeVisible()
		await expect(page.getByTestId('login-email')).toBeVisible()
		await expect(page.getByTestId('login-password')).toBeVisible()
		await expect(page.getByTestId('login-submit')).toBeVisible()
	})

	test('shows validation errors on empty submit', async ({ page }) => {
		await page.getByTestId('login-submit').click()
		await expect(
			page
				.getByTestId('login-email-error')
				.or(page.getByTestId('login-password-error'))
				.first(),
		).toBeVisible()
	})

	test('has a link to register page', async ({ page }) => {
		await page.getByRole('link', { name: 'Sign up' }).click()
		await expect(page).toHaveURL('/auth/register')
	})
})
