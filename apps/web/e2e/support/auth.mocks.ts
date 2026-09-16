import type { Page } from '@playwright/test'
import type { MeResponse } from 'contracts'
import { API_PREFIX, AUTH_ROUTES } from 'contracts'

export const API_ME = `**${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.me}`

export const MOCK_USER: MeResponse = {
	id: 'user-1',
	email: 'test@example.com',
	name: 'Test User',
}

/** Stubs the auth guard's `/auth/me` check as a successful login. */
export async function mockAuth(page: Page, user = MOCK_USER) {
	await page.route(API_ME, (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(user),
		}),
	)
}
