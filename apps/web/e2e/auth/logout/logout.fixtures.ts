import { mockTimeTrackerWeekly } from '../../dashboard/home/home.mocks'
import { mockWorkoutProgress } from '../../dashboard/workout/workout.mocks'
import { seedAccessToken } from '../../support/access-token'
import { test as base } from '../../support/dashboard.fixtures'
import { MOCK_ACCESS_TOKEN } from '../login/login.mocks'
import { mockLogoutResponse } from './logout.mocks'
import { LogoutPage } from './logout-page'

export const test = base.extend<{ logoutPage: LogoutPage }>({
	logoutPage: async ({ page }, use) => {
		await seedAccessToken(page, MOCK_ACCESS_TOKEN)
		await mockTimeTrackerWeekly(page)
		await mockWorkoutProgress(page)
		await mockLogoutResponse(page)
		await use(new LogoutPage(page))
	},
})

export { expect } from '../../support/dashboard.fixtures'
