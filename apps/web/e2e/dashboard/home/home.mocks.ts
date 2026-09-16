import type { Page } from '@playwright/test'
import type { WeeklySummaryResponse } from 'contracts'
import { API_PREFIX, TIME_TRACKER_ROUTES } from 'contracts'

export const API_TIME_TRACKER_WEEKLY = `**${API_PREFIX}${TIME_TRACKER_ROUTES.prefix}${TIME_TRACKER_ROUTES.weekly}*`

export const MOCK_WEEKLY_EMPTY: WeeklySummaryResponse = {
	days: [],
	currentStreakDays: 0,
}

/** Dashboard home also renders the time tracker's weekly chart — stub it empty so it doesn't hit the network. */
export async function mockTimeTrackerWeekly(
	page: Page,
	data: WeeklySummaryResponse = MOCK_WEEKLY_EMPTY,
) {
	await page.route(API_TIME_TRACKER_WEEKLY, (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(data),
		}),
	)
}
