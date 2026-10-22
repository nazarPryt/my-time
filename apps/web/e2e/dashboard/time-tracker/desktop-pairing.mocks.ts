import type { Page } from '@playwright/test'
import { API_PREFIX, AUTH_ROUTES } from 'contracts'

export const DESKTOP_REQUEST_ID = 'b1537b0a-47c7-4a28-bbc6-b4bb5c2b3e7d'
export const API_DESKTOP_INFO = `**${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.desktopPairingInfo}`
export const API_DESKTOP_APPROVE = `**${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.desktopPairingApprove}`
export const DESKTOP_CONFIRMATION_CODE = 'ABC12345'

export async function mockDesktopRequest(page: Page, status = 200) {
	await page.route(API_DESKTOP_INFO, (route) =>
		route.fulfill({
			status,
			contentType: 'application/json',
			body: JSON.stringify(
				status === 200
					? { confirmationCode: DESKTOP_CONFIRMATION_CODE }
					: 'Expired',
			),
		}),
	)
}
export async function mockDesktopApproval(page: Page, status = 200) {
	await page.route(API_DESKTOP_APPROVE, (route) =>
		route.fulfill({
			status,
			contentType: 'application/json',
			body: JSON.stringify(status === 200 ? { connected: true } : 'Expired'),
		}),
	)
}
