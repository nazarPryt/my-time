import type { Locator, Page } from '@playwright/test'
import { TIME_TRACKER_TEST_IDS as TT } from '@/features/time-tracker/testIds'
import { DESKTOP_SETUP_TEST_IDS as DS } from '@/pages/desktop/testIds'
import { DESKTOP_CONNECTION_TEST_IDS as DC } from '@/pages/time-tracker/testIds'
import { BaseLocators } from '../BaseLocators'

export class TimeTrackerLocators extends BaseLocators {
	readonly desktopStatus: Locator
	readonly desktopBack: Locator
	readonly desktopSetup: Locator
	readonly desktopCard: Locator
	readonly desktopCode: Locator
	readonly desktopAccount: Locator
	readonly desktopConnect: Locator
	readonly desktopApproved: Locator
	readonly desktopDismiss: Locator
	readonly desktopError: Locator

	// Page shell
	readonly timeTrackerPage: Locator
	readonly loading: Locator
	readonly error: Locator

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
		this.desktopStatus = page.getByTestId(TT.desktopStatusBadge)
		this.desktopBack = page.getByTestId(DS.back)
		this.desktopSetup = page.getByTestId(DS.setupCard)
		this.desktopCard = page.getByTestId(DC.card)
		this.desktopCode = page.getByTestId(DC.code)
		this.desktopAccount = page.getByTestId(DC.account)
		this.desktopConnect = page.getByTestId(DC.connect)
		this.desktopApproved = page.getByTestId(DC.approved)
		this.desktopDismiss = page.getByTestId(DC.dismiss)
		this.desktopError = page.getByTestId(DC.error)

		this.timeTrackerPage = page.getByTestId(TT.page)
		this.loading = this.timeTrackerPage.getByTestId(TT.loading)
		this.error = this.timeTrackerPage.getByTestId(TT.error)

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
