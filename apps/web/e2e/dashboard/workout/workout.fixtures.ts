import { test as base } from '../../support/dashboard.fixtures'
import { WorkoutPage } from './WorkoutPage'
import { mockWorkoutProgress, mockWorkoutToday } from './workout.mocks'

export const test = base.extend<{ workoutPage: WorkoutPage }>({
	workoutPage: async ({ page }, use) => {
		await mockWorkoutToday(page)
		await mockWorkoutProgress(page)
		await use(new WorkoutPage(page))
	},
})

export { expect } from '@playwright/test'
