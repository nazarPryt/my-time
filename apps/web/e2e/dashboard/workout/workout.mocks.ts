import type { Page } from '@playwright/test'
import type { ProgressResponse, SetResponse, TodayResponse } from 'contracts'
import { API_PREFIX, WORKOUT_ROUTES } from 'contracts'

/** Convert Elysia route params (`:id`) to Playwright glob wildcards (`*`). */
const glob = (route: string) => route.replace(/:[^/]+/g, '*')

const base = `**${API_PREFIX}${WORKOUT_ROUTES.prefix}`

export const API_WORKOUT_TODAY = `${base}${WORKOUT_ROUTES.today}*`
export const API_WORKOUT_SETS = `${base}${WORKOUT_ROUTES.sets}`
export const API_WORKOUT_SET_BY_ID = glob(`${base}${WORKOUT_ROUTES.setById}`)
export const API_WORKOUT_GOAL = `${base}${WORKOUT_ROUTES.goal}`
export const API_WORKOUT_PROGRESS = `${base}${WORKOUT_ROUTES.progress}*`

export const MOCK_SET_1: SetResponse = {
	id: 'set-1',
	exerciseType: 'pushups',
	reps: 10,
	createdAt: '2026-04-14T09:30:00.000Z',
}

export const MOCK_SET_2: SetResponse = {
	id: 'set-2',
	exerciseType: 'pushups',
	reps: 15,
	createdAt: '2026-04-14T10:00:00.000Z',
}

export const MOCK_TODAY_EMPTY: TodayResponse = {
	sets: [],
	goal: { exerciseType: 'pushups', targetReps: 100 },
	total: 0,
}

export const MOCK_TODAY_WITH_SETS: TodayResponse = {
	sets: [MOCK_SET_1, MOCK_SET_2],
	goal: { exerciseType: 'pushups', targetReps: 100 },
	total: 25,
}

export const MOCK_PROGRESS: ProgressResponse = {
	days: Array.from({ length: 30 }, (_, i) => ({
		date: `2026-04-${String(i + 1).padStart(2, '0')}`,
		total: i === 13 ? 25 : i % 5 === 0 ? 110 : i % 3 === 0 ? 60 : 0,
	})),
	goal: { exerciseType: 'pushups', targetReps: 100 },
}

export async function mockWorkoutToday(
	page: Page,
	data: TodayResponse = MOCK_TODAY_WITH_SETS,
) {
	await page.route(API_WORKOUT_TODAY, (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(data),
		}),
	)
}

export async function mockWorkoutProgress(
	page: Page,
	data: ProgressResponse = MOCK_PROGRESS,
) {
	await page.route(API_WORKOUT_PROGRESS, (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(data),
		}),
	)
}
