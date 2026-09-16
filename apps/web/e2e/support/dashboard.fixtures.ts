import { test as base } from '@playwright/test'
import { mockAuth } from './auth.mocks'

/**
 * Base fixture for every dashboard tab: overrides `page` so `/auth/me`
 * always resolves as logged-in before the test body runs. A test that needs
 * to exercise the unauthenticated path re-routes `API_ME` itself.
 */
export const test = base.extend({
	page: async ({ page }, use) => {
		await mockAuth(page)
		await use(page)
	},
})

export { expect } from '@playwright/test'
