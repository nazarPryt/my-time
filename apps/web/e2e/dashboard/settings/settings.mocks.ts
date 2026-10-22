import type { Page } from '@playwright/test'
import { mockTimeTrackerWeekly } from '../home/home.mocks'
import { mockWorkoutProgress } from '../workout/workout.mocks'

/** Settings has no API yet; mock the home destination for the navigation smoke. */
export async function mockSettingsNavigation(page: Page) {
	await mockTimeTrackerWeekly(page)
	await mockWorkoutProgress(page)
}
