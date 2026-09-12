import type { Locator, Page } from '@playwright/test'
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

		this.dashboardHome = page.getByTestId('dashboard-home')
		this.progressChart = this.dashboardHome.getByTestId('progress-chart')
		this.chartMonthLabel = this.progressChart.getByTestId('chart-month-label')
		this.prevMonthBtn = this.progressChart.getByTestId('prev-month-btn')
		this.nextMonthBtn = this.progressChart.getByTestId('next-month-btn')
		this.chartLoading = this.progressChart.getByTestId('chart-loading')
	}
}
