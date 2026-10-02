import type { Page, Route } from '@playwright/test'
import type { BlockedSiteResponse, ExtensionTokenResponse } from 'contracts'
import { API_PREFIX, AUTH_ROUTES, SITE_BLOCKING_ROUTES } from 'contracts'

/** Convert Elysia route params (`:id`) to Playwright glob wildcards (`*`). */
const glob = (route: string) => route.replace(/:[^/]+/g, '*')

const base = `**${API_PREFIX}${SITE_BLOCKING_ROUTES.prefix}`

// Eden calls the collection without a trailing slash (`/site-blocking`), so
// match the prefix itself rather than `${prefix}${root}`.
export const API_SITES = base
export const API_SITE_DELETE = glob(`${base}${SITE_BLOCKING_ROUTES.deleteById}`)
export const API_EXTENSION_TOKEN = `**${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.extensionToken}`
export const FAVICON_URL = 'https://www.google.com/s2/favicons**'

// ── Fixture data ────────────────────────────────────────────────────────────

export const MOCK_SITE_REDDIT: BlockedSiteResponse = {
	id: '11111111-1111-4111-8111-111111111111',
	domain: 'reddit.com',
	createdAt: '2026-09-14T10:00:00.000Z', // "Added Sep 14, 2026"
}

export const MOCK_SITE_YOUTUBE: BlockedSiteResponse = {
	id: '22222222-2222-4222-8222-222222222222',
	domain: 'youtube.com',
	createdAt: '2026-09-20T10:00:00.000Z',
}

/** What POST returns for a newly blocked domain. */
export const MOCK_SITE_NEW: BlockedSiteResponse = {
	id: '33333333-3333-4333-8333-333333333333',
	domain: 'twitter.com',
	createdAt: '2026-10-01T10:00:00.000Z',
}

export const MOCK_SITES = [MOCK_SITE_REDDIT, MOCK_SITE_YOUTUBE]

export const MOCK_EXTENSION_TOKEN: ExtensionTokenResponse = {
	token: '44444444-4444-4444-8444-444444444444',
}

// Tiny SVG, so favicons render without hitting Google.
const FAVICON_SVG =
	'<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'

// ── Route stubs ─────────────────────────────────────────────────────────────

export interface StubOptions {
	status?: number
	/** Hold the response this long — keeps loading/submitting states visible. */
	delayMs?: number
}

const json = (body: unknown, status = 200) => ({
	status,
	contentType: 'application/json',
	body: JSON.stringify(body),
})

async function fulfill(
	route: Route,
	body: unknown,
	{ status = 200, delayMs = 0 }: StubOptions,
) {
	if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs))
	await route.fulfill(json(body, status))
}

/** GET /site-blocking → the block list. */
export async function mockSitesList(
	page: Page,
	data: BlockedSiteResponse[] = MOCK_SITES,
	options: StubOptions = {},
) {
	await page.route(API_SITES, (route) => {
		if (route.request().method() !== 'GET') return route.fallback()
		return fulfill(route, data, options)
	})
}

/**
 * POST /site-blocking → 201 with the created site. To fail, pass an error body
 * and status, e.g. `(page, SITE_BLOCKING_ERRORS.DOMAIN_ALREADY_BLOCKED, { status: 409 })`.
 */
export async function mockSiteAdd(
	page: Page,
	data: unknown = MOCK_SITE_NEW,
	{ status = 201, delayMs }: StubOptions = {},
) {
	await page.route(API_SITES, (route) => {
		if (route.request().method() !== 'POST') return route.fallback()
		return fulfill(route, data, { status, delayMs })
	})
}

/** DELETE /site-blocking/:id → the real handler returns an empty 200. */
export async function mockSiteDelete(
	page: Page,
	{ status = 200, delayMs = 0 }: StubOptions = {},
) {
	await page.route(API_SITE_DELETE, async (route) => {
		if (route.request().method() !== 'DELETE') return route.fallback()
		if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs))
		await route.fulfill({ status, body: '' })
	})
}

/** POST /auth/extension-token → one-time token the page hands to the extension. */
export async function mockExtensionToken(
	page: Page,
	data: unknown = MOCK_EXTENSION_TOKEN,
	options: StubOptions = {},
) {
	await page.route(API_EXTENSION_TOKEN, (route) =>
		fulfill(route, data, options),
	)
}

/** Google favicon service — `ok: false` 404s to exercise the hide-on-error path. */
export async function mockFavicons(page: Page, { ok = true } = {}) {
	await page.route(FAVICON_URL, (route) =>
		ok
			? route.fulfill({
					status: 200,
					contentType: 'image/svg+xml',
					body: FAVICON_SVG,
				})
			: route.fulfill({ status: 404 }),
	)
}
