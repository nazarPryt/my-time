import { test as base } from '@playwright/test'
import { HomePage } from '../../dashboard/home/HomePage'
import { mockTimeTrackerWeekly } from '../../dashboard/home/home.mocks'
import { mockWorkoutProgress } from '../../dashboard/workout/workout.mocks'
import {
	MOCK_ACCESS_TOKEN,
	MOCK_LOGIN_SUCCESS,
	mockAuthenticatedAccount,
	mockRefreshResponse,
} from '../login/login.mocks'
import { RegisterPage } from './RegisterPage'
import { mockRegisterResponse } from './register.mocks'

export const test = base.extend<{
	registerPage: RegisterPage
	homePage: HomePage
}>({
	registerPage: async ({ page }, use) => {
		await mockAuthenticatedAccount(page, MOCK_ACCESS_TOKEN)
		await mockRefreshResponse(page, 401)
		await mockRegisterResponse(page, 200, MOCK_LOGIN_SUCCESS)
		await mockTimeTrackerWeekly(page)
		await mockWorkoutProgress(page)
		await use(new RegisterPage(page))
	},
	homePage: async ({ page }, use) => {
		await use(new HomePage(page))
	},
})

export { expect } from '@playwright/test'
