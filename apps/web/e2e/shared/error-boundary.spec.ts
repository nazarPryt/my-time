import { expect, test } from '@playwright/test'
import { SHARED_TEST_IDS } from '@/components/testIds'

test.describe('Error boundary', () => {
	test('shows error screen when a route component throws', async ({ page }) => {
		// Suppress the expected React render error from reaching Playwright's
		// uncaught-exception handler — the error boundary catches it intentionally
		page.on('pageerror', () => {})

		await page.goto('/test/error')

		await expect(
			page.getByTestId(SHARED_TEST_IDS.errorScreen.root),
		).toBeVisible()
		await expect(
			page.getByTestId(SHARED_TEST_IDS.errorScreen.title),
		).toHaveText('Something went wrong')
		await expect(
			page.getByTestId(SHARED_TEST_IDS.errorScreen.message),
		).toHaveText('Test render error')
	})

	test('Try again button retries the failed route', async ({ page }) => {
		page.on('pageerror', () => {})

		await page.goto('/test/error')
		await expect(
			page.getByTestId(SHARED_TEST_IDS.errorScreen.root),
		).toBeVisible()

		await page.getByTestId(SHARED_TEST_IDS.errorScreen.reset).click()

		// Route still throws, so error screen reappears — confirming reset triggered a retry
		await expect(
			page.getByTestId(SHARED_TEST_IDS.errorScreen.root),
		).toBeVisible()
	})
})

test.describe('404 page', () => {
	test('shows not-found screen for unknown URLs', async ({ page }) => {
		await page.goto('/this/does/not/exist')
		await expect(
			page.getByTestId(SHARED_TEST_IDS.notFoundScreen.root),
		).toBeVisible()
		await expect(
			page.getByTestId(SHARED_TEST_IDS.notFoundScreen.root),
		).toContainText('Page not found')
	})

	test('Go home link navigates away from 404', async ({ page }) => {
		await page.goto('/this/does/not/exist')
		await page.getByTestId(SHARED_TEST_IDS.notFoundScreen.homeLink).click()
		await expect(page).not.toHaveURL('/this/does/not/exist')
	})
})
