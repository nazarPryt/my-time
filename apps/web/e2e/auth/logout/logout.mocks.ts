import type { Page } from '@playwright/test'
import { API_PREFIX, AUTH_ROUTES } from 'contracts'

export const API_LOGOUT = `**${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.logout}`

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
