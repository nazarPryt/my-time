import type { Locator, Page } from '@playwright/test'
import { DASHBOARD_TEST_IDS } from '@/feature/dashboard/testIds'
import { WORKOUT_TEST_IDS } from '@/feature/workout/testIds'
import { BaseLocators } from '../BaseLocators'

export class HomeLocators extends BaseLocators {
	readonly dashboardHome: Locator
	readonly progressChart: Locator
	readonly chartMonthLabel: Locator
	readonly prevMonthBtn: Locator
	readonly nextMonthBtn: Locator
	readonly chartLoading: Locator

	constructor(page: Page) {
		super(page)

		this.dashboardHome = page.getByTestId(DASHBOARD_TEST_IDS.home)
		this.progressChart = this.dashboardHome.getByTestId(
			WORKOUT_TEST_IDS.progressChart,
		)
		this.chartMonthLabel = this.progressChart.getByTestId(
			WORKOUT_TEST_IDS.chartMonthLabel,
		)
		this.prevMonthBtn = this.progressChart.getByTestId(
			WORKOUT_TEST_IDS.prevMonthBtn,
		)
		this.nextMonthBtn = this.progressChart.getByTestId(
			WORKOUT_TEST_IDS.nextMonthBtn,
		)
		this.chartLoading = this.progressChart.getByTestId(
			WORKOUT_TEST_IDS.chartLoading,
		)
	}
}
