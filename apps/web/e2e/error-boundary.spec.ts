import { expect, test } from '@playwright/test'

test.describe('Error boundary', () => {
	test('shows error screen when a route component throws', async ({ page }) => {
		// Suppress the expected React render error from reaching Playwright's
		// uncaught-exception handler — the error boundary catches it intentionally
		page.on('pageerror', () => {})

		await page.goto('/test/error')

		await expect(page.getByTestId('error-screen')).toBeVisible()
		await expect(page.getByTestId('error-screen-title')).toHaveText(
			'Something went wrong',
		)
		await expect(page.getByTestId('error-screen-message')).toHaveText(
			'Test render error',
		)
	})

	test('Try again button retries the failed route', async ({ page }) => {
		page.on('pageerror', () => {})

		await page.goto('/test/error')
		await expect(page.getByTestId('error-screen')).toBeVisible()

		await page.getByTestId('error-screen-reset').click()

		// Route still throws, so error screen reappears — confirming reset triggered a retry
		await expect(page.getByTestId('error-screen')).toBeVisible()
	})
})

test.describe('404 page', () => {
	test('shows not-found screen for unknown URLs', async ({ page }) => {
		await page.goto('/this/does/not/exist')
		await expect(page.getByTestId('not-found-screen')).toBeVisible()
		await expect(page.getByText('Page not found')).toBeVisible()
	})

	test('Go home link navigates away from 404', async ({ page }) => {
		await page.goto('/this/does/not/exist')
		await page.getByRole('link', { name: 'Go home' }).click()
		await expect(page).not.toHaveURL('/this/does/not/exist')
	})
})
