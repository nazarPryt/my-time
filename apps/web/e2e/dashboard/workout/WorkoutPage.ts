import type { LinkProps } from '@tanstack/react-router'
import { WorkoutLocators } from './workout.locators'

export const WORKOUT_PATH: LinkProps['to'] = '/dashboard/workout'

export class WorkoutPage extends WorkoutLocators {
	async goto() {
		await this.page.goto(WORKOUT_PATH)
		await this.heroCounter.waitFor({ state: 'visible' })
	}
}
