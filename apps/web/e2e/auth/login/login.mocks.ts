import type { Page } from '@playwright/test'
import type { AuthResponse } from 'contracts'
import { API_PREFIX, AUTH_ROUTES } from 'contracts'
import { API_ME, MOCK_USER } from '../../support/auth.mocks'

export const LOGIN_API_PATH = `${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.login}`
export const REFRESH_API_PATH = `${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.refresh}`
export const API_LOGIN = `**${LOGIN_API_PATH}`
export const API_REFRESH = `**${REFRESH_API_PATH}`

export const MOCK_ACCESS_TOKEN = 'login-access-token'
export const MOCK_REFRESHED_ACCESS_TOKEN = 'refreshed-access-token'
export const MOCK_UNAVAILABLE_ACCESS_TOKEN = 'unavailable-token'

export async function mockLoginResponse(
	page: Page,
	status: number,
	body: object,
) {
	await page.route(API_LOGIN, (route) =>
		route.fulfill({
			status,
			contentType: 'application/json',
			body: JSON.stringify(body),
		}),
	)
}

export const MOCK_LOGIN_SUCCESS: AuthResponse = {
	user: MOCK_USER,
	tokens: { accessToken: MOCK_ACCESS_TOKEN },
}

/** Reject the guard unless it actually receives the token returned by login. */
export async function mockAuthenticatedAccount(
	page: Page,
	token = MOCK_ACCESS_TOKEN,
) {
	await page.route(API_ME, (route) => {
		const authorized =
			route.request().headers().authorization === `Bearer ${token}`
		return route.fulfill({
			status: authorized ? 200 : 401,
			contentType: 'application/json',
			body: JSON.stringify(authorized ? MOCK_USER : { code: 'UNAUTHORIZED' }),
		})
	})
}

export async function mockRefreshResponse(
	page: Page,
	status: number,
	token = MOCK_REFRESHED_ACCESS_TOKEN,
) {
	await page.route(API_REFRESH, (route) =>
		route.fulfill({
			status,
			contentType: 'application/json',
			body: JSON.stringify(
				status === 200
					? { tokens: { accessToken: token } }
					: { code: 'UNAUTHORIZED' },
			),
		}),
	)
}

/** Hold the response until the spec has checked the pending form. */
export async function holdLoginResponse(page: Page) {
	let release!: () => void
	const held = new Promise<void>((resolve) => {
		release = resolve
	})
	let requests = 0
	await page.route(API_LOGIN, async (route) => {
		requests++
		await held
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(MOCK_LOGIN_SUCCESS),
		})
	})
	return { release: () => release(), requests: () => requests }
}
