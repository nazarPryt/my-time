import { test as base } from '../../support/dashboard.fixtures'
import { mockWorkoutProgress } from '../workout/workout.mocks'
import { HomePage } from './HomePage'
import { mockTimeTrackerWeekly } from './home.mocks'

export const test = base.extend<{ homePage: HomePage }>({
	homePage: async ({ page }, use) => {
		await mockTimeTrackerWeekly(page)
		await mockWorkoutProgress(page)
		await use(new HomePage(page))
	},
})

export { expect } from '@playwright/test'
