import { test as base } from '@playwright/test'
import { HomePage } from '../../dashboard/home/HomePage'
import { mockTimeTrackerWeekly } from '../../dashboard/home/home.mocks'
import { mockWorkoutProgress } from '../../dashboard/workout/workout.mocks'
import { mockLogoutResponse } from '../logout/logout.mocks'
import { LoginPage } from './LoginPage'
import {
	MOCK_LOGIN_SUCCESS,
	mockAuthenticatedAccount,
	mockLoginResponse,
	mockRefreshResponse,
} from './login.mocks'

export const test = base.extend<{ loginPage: LoginPage; homePage: HomePage }>({
	loginPage: async ({ page }, use) => {
		await mockAuthenticatedAccount(page)
		await mockLoginResponse(page, 200, MOCK_LOGIN_SUCCESS)
		await mockRefreshResponse(page, 401)
		await mockLogoutResponse(page)
		await mockTimeTrackerWeekly(page)
		await mockWorkoutProgress(page)
		await use(new LoginPage(page))
	},
	homePage: async ({ page }, use) => {
		await use(new HomePage(page))
	},
})

export { expect } from '@playwright/test'
