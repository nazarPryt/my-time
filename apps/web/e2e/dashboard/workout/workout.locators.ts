import type { Locator, Page } from '@playwright/test'
import { BaseLocators } from '../BaseLocators'

export class WorkoutLocators extends BaseLocators {
	// Page container
	readonly workoutPage: Locator
	readonly workoutLoading: Locator

	// Header
	readonly header: Locator
	readonly dateLabel: Locator

	// Hero counter
	readonly heroCounter: Locator
	readonly totalReps: Locator
	readonly progressBarFill: Locator
	readonly repsLeft: Locator
	readonly goalReached: Locator
	readonly goalDisplayBtn: Locator
	readonly goalInput: Locator
	readonly goalSetBtn: Locator

	// Quick add buttons
	readonly quickAddButtons: Locator

	// Sets log
	readonly setsLogEmpty: Locator
	readonly setsLog: Locator
	readonly setsCount: Locator
	readonly resetDayTrigger: Locator
	readonly setRows: Locator

	constructor(page: Page) {
		super(page)

		this.workoutPage = page.getByTestId('workout-page')
		this.workoutLoading = this.workoutPage.getByTestId('workout-loading')

		this.header = this.workoutPage.getByTestId('workout-header')
		this.dateLabel = this.header.getByTestId('workout-date')

		this.heroCounter = this.workoutPage.getByTestId('hero-counter')
		this.totalReps = this.heroCounter.getByTestId('total-reps')
		this.progressBarFill = this.heroCounter.getByTestId('progress-bar-fill')
		this.repsLeft = this.heroCounter.getByTestId('reps-left')
		this.goalReached = this.heroCounter.getByTestId('goal-reached')
		this.goalDisplayBtn = this.heroCounter.getByTestId('goal-display-btn')
		this.goalInput = this.heroCounter.getByTestId('goal-input')
		this.goalSetBtn = this.heroCounter.getByTestId('goal-set-btn')

		this.quickAddButtons = this.workoutPage.getByTestId('quick-add-buttons')

		this.setsLogEmpty = this.workoutPage.getByTestId('sets-log-empty')
		this.setsLog = this.workoutPage.getByTestId('sets-log')
		this.setsCount = this.setsLog.getByTestId('sets-count')
		this.resetDayTrigger = this.setsLog.getByTestId('reset-day-trigger')
		this.setRows = this.setsLog.getByTestId('set-row')
	}

	quickAddBtn(reps: number) {
		return this.quickAddButtons.getByTestId(`quick-add-${reps}`)
	}
}
