import type { LinkProps } from '@tanstack/react-router'
import { WorkoutLocators } from './workout.locators'

export const WORKOUT_PATH: LinkProps['to'] = '/dashboard/workout'

export class WorkoutPage extends WorkoutLocators {
	async goto() {
		await this.page.goto(WORKOUT_PATH)
		await this.heroCounter.waitFor({ state: 'visible' })
	}
	async quickAdd(reps: number) {
		await this.quickAddBtn(reps).click()
	}
	async deleteFirstSet() {
		await this.deleteSetTrigger(0).click()
		await this.confirmDialogConfirmBtn.click()
	}
	async resetDay() {
		await this.resetDayTrigger.click()
		await this.confirmDialogConfirmBtn.click()
	}
	async setGoal(reps: number) {
		await this.goalDisplayBtn.click()
		await this.goalInput.fill(String(reps))
		await this.goalSetBtn.click()
	}
}
