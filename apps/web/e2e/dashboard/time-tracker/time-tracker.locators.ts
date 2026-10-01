import type { Locator, Page } from '@playwright/test'
import { TIME_TRACKER_TEST_IDS as TT } from '@/features/time-tracker/testIds'
import { BaseLocators } from '../BaseLocators'

export class TimeTrackerLocators extends BaseLocators {
	// Page shell
	readonly timeTrackerPage: Locator
	readonly loading: Locator

	// Timer card
	readonly statusBadge: Locator
	readonly timer: Locator
	readonly startBtn: Locator
	readonly stopBtn: Locator
	readonly deleteTrigger: Locator

	// Today stats
	readonly todayStats: Locator
	readonly statToday: Locator
	readonly statSessions: Locator
	readonly statLongest: Locator

	// Session list
	readonly sessionList: Locator
	readonly sessionRows: Locator

	constructor(page: Page) {
		super(page)

		this.timeTrackerPage = page.getByTestId(TT.page)
		this.loading = this.timeTrackerPage.getByTestId(TT.loading)

		this.statusBadge = this.timeTrackerPage.getByTestId(TT.statusBadge)
		this.timer = this.timeTrackerPage.getByTestId(TT.timer)
		this.startBtn = this.timeTrackerPage.getByTestId(TT.startBtn)
		this.stopBtn = this.timeTrackerPage.getByTestId(TT.stopBtn)
		this.deleteTrigger = this.timeTrackerPage.getByTestId(TT.deleteTrigger)

		this.todayStats = this.timeTrackerPage.getByTestId(TT.todayStats)
		this.statToday = this.todayStats.getByTestId(TT.statToday)
		this.statSessions = this.todayStats.getByTestId(TT.statSessions)
		this.statLongest = this.todayStats.getByTestId(TT.statLongest)

		this.sessionList = this.timeTrackerPage.getByTestId(TT.sessionList)
		this.sessionRows = this.sessionList.getByTestId(TT.sessionRow)
	}

	/** The nth session row (0-indexed), in render order. */
	sessionRow(index: number) {
		return this.sessionRows.nth(index)
	}

	sessionTime(index: number) {
		return this.sessionRow(index).getByTestId(TT.sessionTime)
	}

	sessionDuration(index: number) {
		return this.sessionRow(index).getByTestId(TT.sessionDuration)
	}

	sessionActiveBadge(index: number) {
		return this.sessionRow(index).getByTestId(TT.sessionActiveBadge)
	}

	sessionAbandoned(index: number) {
		return this.sessionRow(index).getByTestId(TT.sessionAbandoned)
	}
}
