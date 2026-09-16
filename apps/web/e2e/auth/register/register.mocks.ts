import type { Page } from '@playwright/test'
import { API_PREFIX, AUTH_ROUTES } from 'contracts'

export const API_REGISTER = `**${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.register}`

export async function mockRegisterResponse(
	page: Page,
	status: number,
	body: object,
) {
	await page.route(API_REGISTER, (route) =>
		route.fulfill({
			status,
			contentType: 'application/json',
			body: JSON.stringify(body),
		}),
	)
}
