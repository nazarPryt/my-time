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

export const MOCK_WEEKLY_WITH_SESSIONS: WeeklySummaryResponse = {
	days: [
		{
			date: new Date('2026-10-12T00:00:00Z'),
			totalWorkSeconds: 5400,
			sessionsCompleted: 2,
		},
		{
			date: new Date('2026-10-11T00:00:00Z'),
			totalWorkSeconds: 0,
			sessionsCompleted: 0,
		},
		{
			date: new Date('2026-10-10T00:00:00Z'),
			totalWorkSeconds: 3600,
			sessionsCompleted: 1,
		},
	],
	currentStreakDays: 1,
}

export async function mockTimeTrackerWeeklyFailure(page: Page) {
	await page.route(API_TIME_TRACKER_WEEKLY, (route) =>
		route.fulfill({
			status: 503,
			contentType: 'application/json',
			body: JSON.stringify({ message: 'Unavailable' }),
		}),
	)
}

export async function holdTimeTrackerWeekly(page: Page) {
	let release!: () => void
	const held = new Promise<void>((resolve) => {
		release = resolve
	})
	await page.route(API_TIME_TRACKER_WEEKLY, async (route) => {
		await held
		await route.fulfill({
			contentType: 'application/json',
			body: JSON.stringify(MOCK_WEEKLY_WITH_SESSIONS),
		})
	})
	return { release: () => release() }
}
