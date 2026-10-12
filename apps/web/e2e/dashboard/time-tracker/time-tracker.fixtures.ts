import { ACCESS_TOKEN_KEY } from '@/shared/lib/token-storage'
import { MOCK_ACCESS_TOKEN } from '../../auth/login/login.mocks'
import { test as base } from '../../support/dashboard.fixtures'
import { TimeTrackerPage } from './TimeTrackerPage'
import {
	mockTimeActive,
	mockTimeDelete,
	mockTimeEnd,
	mockTimeStart,
	mockTimeToday,
	mockTimeWeekly,
} from './time-tracker.mocks'

export const test = base.extend<{ timeTrackerPage: TimeTrackerPage }>({
	timeTrackerPage: async ({ page }, use) => {
		// The SSE client authenticates before opening its stream. These are mock
		// credentials only; the base dashboard fixture stubs /auth/me separately.
		await page.addInitScript(
			({ key, token }) => localStorage.setItem(key, token),
			{ key: ACCESS_TOKEN_KEY, token: MOCK_ACCESS_TOKEN },
		)
		// Default state: idle (no active session) with a populated "today".
		// Order matters — the DELETE `/:id` glob also matches the GET routes, so
		// it is registered LAST and falls back to these more specific handlers.
		await mockTimeActive(page, null)
		await mockTimeToday(page)
		await mockTimeWeekly(page)
		await mockTimeStart(page)
		await mockTimeEnd(page)
		await mockTimeDelete(page)
		await use(new TimeTrackerPage(page))
	},
})

export { expect } from '@playwright/test'
