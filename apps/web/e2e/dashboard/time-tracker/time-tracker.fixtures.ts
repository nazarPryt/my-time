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
