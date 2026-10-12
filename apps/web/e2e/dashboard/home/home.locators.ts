import type { Locator, Page } from '@playwright/test'
import { TIME_TRACKER_TEST_IDS as TT } from '@/features/time-tracker/testIds'
import { WORKOUT_TEST_IDS } from '@/features/workout/testIds'
import { DASHBOARD_TEST_IDS } from '@/shared/ui/testIds'
import { BaseLocators } from '../BaseLocators'

export class HomeLocators extends BaseLocators {
	readonly timeChart: Locator
	readonly timeChartLoading: Locator
	readonly timeChartEmpty: Locator
	readonly timeChartSummary: Locator
	readonly timeChartBars: Locator
	readonly timeChartTooltip: Locator
	readonly dashboardHome: Locator
	readonly progressChart: Locator
	readonly chartMonthLabel: Locator
	readonly prevMonthBtn: Locator
	readonly nextMonthBtn: Locator
	readonly chartLoading: Locator

	constructor(page: Page) {
		super(page)

		this.timeChart = page.getByTestId(TT.progressChart)
		this.timeChartLoading = this.timeChart.getByTestId(TT.chartLoading)
		this.timeChartEmpty = this.timeChart.getByTestId(TT.chartEmpty)
		this.timeChartSummary = this.timeChart.getByTestId(TT.chartSummary)
		this.timeChartBars = this.timeChart.getByTestId(TT.chartBar)
		this.timeChartTooltip = this.timeChart.getByTestId(TT.chartTooltip)
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
