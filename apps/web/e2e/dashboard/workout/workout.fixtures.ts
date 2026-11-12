import { test as base } from '../../support/dashboard.fixtures'
import { mockWorkoutProgress, mockWorkoutToday } from './workout.mocks'
import { WorkoutPage } from './workout-page'

export const test = base.extend<{ workoutPage: WorkoutPage }>({
	workoutPage: async ({ page }, use) => {
		await mockWorkoutToday(page)
		await mockWorkoutProgress(page)
		await use(new WorkoutPage(page))
	},
})

export { expect } from '@playwright/test'
