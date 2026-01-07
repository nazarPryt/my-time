import { test, expect } from '@playwright/test'

// Example E2E test to verify Playwright setup
test('should load the application', async ({ page }) => {
  await page.goto('/')

  // Verify the page loaded
  await expect(page).toHaveTitle(/my-time/i)
})
