import { API_PREFIX, AUTH_ROUTES } from '@my-time/contracts'
import type { Page } from '@playwright/test'

export const LOGOUT_API_PATH = `${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.logout}`
export const API_LOGOUT = `**${LOGOUT_API_PATH}`

export async function mockLogoutResponse(
	page: Page,
	status = 200,
	body: object = {},
) {
	await page.route(API_LOGOUT, (route) =>
		route.fulfill({
			status,
			contentType: 'application/json',
			body: JSON.stringify(body),
		}),
	)
}
