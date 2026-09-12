import { WorkoutLocators } from './workout.locators'

export const WORKOUT_PATH = '/dashboard/workout'

export class WorkoutPage extends WorkoutLocators {
	async goto() {
		await this.page.goto(WORKOUT_PATH)
		await this.heroCounter.waitFor({ state: 'visible' })
	}
}
