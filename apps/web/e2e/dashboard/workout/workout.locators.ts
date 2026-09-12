import type { Locator, Page } from '@playwright/test'
import { WORKOUT_TEST_IDS } from '@/feature/workout/testIds'
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

		this.workoutPage = page.getByTestId(WORKOUT_TEST_IDS.page)
		this.workoutLoading = this.workoutPage.getByTestId(WORKOUT_TEST_IDS.loading)

		this.header = this.workoutPage.getByTestId(WORKOUT_TEST_IDS.header)
		this.dateLabel = this.header.getByTestId(WORKOUT_TEST_IDS.date)

		this.heroCounter = this.workoutPage.getByTestId(
			WORKOUT_TEST_IDS.heroCounter,
		)
		this.totalReps = this.heroCounter.getByTestId(WORKOUT_TEST_IDS.totalReps)
		this.progressBarFill = this.heroCounter.getByTestId(
			WORKOUT_TEST_IDS.progressBarFill,
		)
		this.repsLeft = this.heroCounter.getByTestId(WORKOUT_TEST_IDS.repsLeft)
		this.goalReached = this.heroCounter.getByTestId(
			WORKOUT_TEST_IDS.goalReached,
		)
		this.goalDisplayBtn = this.heroCounter.getByTestId(
			WORKOUT_TEST_IDS.goalDisplayBtn,
		)
		this.goalInput = this.heroCounter.getByTestId(WORKOUT_TEST_IDS.goalInput)
		this.goalSetBtn = this.heroCounter.getByTestId(WORKOUT_TEST_IDS.goalSetBtn)

		this.quickAddButtons = this.workoutPage.getByTestId(
			WORKOUT_TEST_IDS.quickAddButtons,
		)

		this.setsLogEmpty = this.workoutPage.getByTestId(
			WORKOUT_TEST_IDS.setsLogEmpty,
		)
		this.setsLog = this.workoutPage.getByTestId(WORKOUT_TEST_IDS.setsLog)
		this.setsCount = this.setsLog.getByTestId(WORKOUT_TEST_IDS.setsCount)
		this.resetDayTrigger = this.setsLog.getByTestId(
			WORKOUT_TEST_IDS.resetDayTrigger,
		)
		this.setRows = this.setsLog.getByTestId(WORKOUT_TEST_IDS.setRow)
	}

	quickAddBtn(reps: number) {
		return this.quickAddButtons.getByTestId(WORKOUT_TEST_IDS.quickAddBtn(reps))
	}
}
