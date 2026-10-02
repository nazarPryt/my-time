import type { Page } from '@playwright/test'
import type {
	SessionResponse,
	TodaySummaryResponse,
	WeeklySummaryResponse,
} from 'contracts'
import { API_PREFIX, TIME_TRACKER_ROUTES } from 'contracts'

/** Convert Elysia route params (`:id`) to Playwright glob wildcards (`*`). */
const glob = (route: string) => route.replace(/:[^/]+/g, '*')

const base = `**${API_PREFIX}${TIME_TRACKER_ROUTES.prefix}`

export const API_TIME_ACTIVE = `${base}${TIME_TRACKER_ROUTES.active}`
export const API_TIME_TODAY = `${base}${TIME_TRACKER_ROUTES.today}`
export const API_TIME_WEEKLY = `${base}${TIME_TRACKER_ROUTES.weekly}`
export const API_TIME_START = `${base}${TIME_TRACKER_ROUTES.start}`
export const API_TIME_END = glob(`${base}${TIME_TRACKER_ROUTES.endById}`)
// `/:id` collides with `/active`, `/today`, `/weekly`, `/start` as a glob, so
// the delete handler filters by HTTP method and falls back for everything else.
export const API_TIME_DELETE = glob(`${base}${TIME_TRACKER_ROUTES.deleteById}`)

// ── Fixture data ────────────────────────────────────────────────────────────

/** Completed: 08:00 → 08:30 (1800s → "30m"). */
export const MOCK_SESSION_SHORT: SessionResponse = {
	id: 'sess-short',
	type: 'work',
	startedAt: new Date('2026-10-01T08:00:00.000Z'),
	endedAt: new Date('2026-10-01T08:30:00.000Z'),
	abandonedAt: null,
}

/** Completed: 09:00 → 10:30 (5400s → "1h 30m"). */
export const MOCK_SESSION_LONG: SessionResponse = {
	id: 'sess-long',
	type: 'work',
	startedAt: new Date('2026-10-01T09:00:00.000Z'),
	endedAt: new Date('2026-10-01T10:30:00.000Z'),
	abandonedAt: null,
}

/** Abandoned: started 11:00, never completed. */
export const MOCK_SESSION_ABANDONED: SessionResponse = {
	id: 'sess-abandoned',
	type: 'work',
	startedAt: new Date('2026-10-01T11:00:00.000Z'),
	endedAt: null,
	abandonedAt: new Date('2026-10-01T11:05:00.000Z'),
}

/** Currently running: started, not ended, not abandoned. */
export const MOCK_SESSION_ACTIVE: SessionResponse = {
	id: 'sess-active',
	type: 'work',
	startedAt: new Date('2026-10-01T12:00:00.000Z'),
	endedAt: null,
	abandonedAt: null,
}

/**
 * A running session that began `seconds` ago, built at call time. The timer's
 * elapsed is derived from `startedAt` (not a from-zero counter), so timer
 * assertions need a start time relative to "now" — a fixed past date would
 * render as many hours. Use this instead of MOCK_SESSION_ACTIVE whenever the
 * test asserts the elapsed value.
 */
export function activeSessionStartedSecondsAgo(
	seconds: number,
): SessionResponse {
	return {
		id: 'sess-active',
		type: 'work',
		startedAt: new Date(Date.now() - seconds * 1000),
		endedAt: null,
		abandonedAt: null,
	}
}

export const MOCK_TODAY_WITH_SESSIONS: TodaySummaryResponse = {
	sessions: [MOCK_SESSION_SHORT, MOCK_SESSION_LONG, MOCK_SESSION_ABANDONED],
	totalWorkSeconds: 7200, // "2h"
	sessionsCompleted: 2,
	longestSessionSeconds: 5400, // "1h 30m"
}

export const MOCK_TODAY_EMPTY: TodaySummaryResponse = {
	sessions: [],
	totalWorkSeconds: 0,
	sessionsCompleted: 0,
	longestSessionSeconds: 0,
}

export const MOCK_WEEKLY_EMPTY: WeeklySummaryResponse = {
	days: [],
	currentStreakDays: 0,
}

// ── Route stubs ─────────────────────────────────────────────────────────────

const json = (body: unknown, status = 200) => ({
	status,
	contentType: 'application/json',
	body: JSON.stringify(body),
})

/** GET /active — pass `null` for the idle (no running session) case. */
export async function mockTimeActive(
	page: Page,
	data: SessionResponse | null = null,
) {
	await page.route(API_TIME_ACTIVE, (route) => route.fulfill(json(data)))
}

/** GET /today */
export async function mockTimeToday(
	page: Page,
	data: TodaySummaryResponse = MOCK_TODAY_WITH_SESSIONS,
) {
	await page.route(API_TIME_TODAY, (route) => route.fulfill(json(data)))
}

/** GET /weekly (not fetched by the page, stubbed defensively). */
export async function mockTimeWeekly(
	page: Page,
	data: WeeklySummaryResponse = MOCK_WEEKLY_EMPTY,
) {
	await page.route(API_TIME_WEEKLY, (route) => route.fulfill(json(data)))
}

/** POST /start → the newly created active session. */
export async function mockTimeStart(
	page: Page,
	data: SessionResponse = MOCK_SESSION_ACTIVE,
) {
	await page.route(API_TIME_START, (route) => {
		if (route.request().method() !== 'POST') return route.fallback()
		return route.fulfill(json(data))
	})
}

/** PATCH /:id/end → the ended session. */
export async function mockTimeEnd(
	page: Page,
	data: SessionResponse = {
		...MOCK_SESSION_ACTIVE,
		endedAt: new Date('2026-10-01T12:30:00.000Z'),
	},
) {
	await page.route(API_TIME_END, (route) => {
		if (route.request().method() !== 'PATCH') return route.fallback()
		return route.fulfill(json(data))
	})
}

/**
 * DELETE /:id → the abandoned session. Registered last by the fixture; for any
 * non-DELETE request on this glob (e.g. GET /today) it falls back to the
 * earlier, more specific handler.
 */
export async function mockTimeDelete(
	page: Page,
	data: SessionResponse = {
		...MOCK_SESSION_ACTIVE,
		abandonedAt: new Date('2026-10-01T12:30:00.000Z'),
	},
) {
	await page.route(API_TIME_DELETE, (route) => {
		if (route.request().method() !== 'DELETE') return route.fallback()
		return route.fulfill(json(data))
	})
}
