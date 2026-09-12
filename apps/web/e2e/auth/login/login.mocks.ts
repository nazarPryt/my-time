import type { Page } from '@playwright/test'
import { API_PREFIX, AUTH_ROUTES } from 'contracts'

export const API_LOGIN = `**${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.login}`

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
