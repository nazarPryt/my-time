import type { Page } from '@playwright/test'
import type { DailySummary } from 'contracts'
import { API_PREFIX, TIME_TRACKER_ROUTES } from 'contracts'

export const API_TIME_TRACKER_WEEKLY = `**${API_PREFIX}${TIME_TRACKER_ROUTES.prefix}${TIME_TRACKER_ROUTES.weekly}*`

/** Dashboard home also renders the time tracker's weekly chart — stub it empty so it doesn't hit the network. */
export async function mockTimeTrackerWeekly(
	page: Page,
	data: DailySummary[] = [],
) {
	await page.route(API_TIME_TRACKER_WEEKLY, (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(data),
		}),
	)
}
