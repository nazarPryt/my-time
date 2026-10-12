import type { Page } from '@playwright/test'
import {
	API_PREFIX,
	type CheckResultResponse,
	PERMESSO_ROUTES,
	type PermessoCheckHistoryResponse,
	type PermessoStatusResponse,
} from 'contracts'

const base = `${API_PREFIX}${PERMESSO_ROUTES.prefix}`
export const API_PERMESSO = `**${base}{,/}`
export const API_PERMESSO_CHECK = `**${base}${PERMESSO_ROUTES.check}`
export const API_PERMESSO_HISTORY = `**${base}${PERMESSO_ROUTES.history}`
export const API_PERMESSO_SCHEDULE = `**${base}${PERMESSO_ROUTES.schedule}`
export const API_PERMESSO_LINK = `**${base}${PERMESSO_ROUTES.telegramLink}`
export const API_PERMESSO_LINK_EVENTS = `**${base}${PERMESSO_ROUTES.telegramLinkEvents}`
export const API_PERMESSO_DISCONNECT = `**${base}${PERMESSO_ROUTES.telegramDisconnect}`
export const API_PERMESSO_RESET = `**${base}${PERMESSO_ROUTES.reset}`
export const MOCK_PRACTICE_NUMBER = 'ABC1234567'
export const MOCK_REPLACEMENT_NUMBER = 'XYZ1234567'
export const MOCK_TELEGRAM_LINK =
	'https://t.me/my_time_test_bot?start=test-link'
export const MOCK_PERMESSO_EMPTY: PermessoStatusResponse = {
	practiceNumber: null,
	checkHours: [],
	lastStatus: null,
	lastCheckedAt: null,
	lastError: null,
	telegramConnected: false,
}
export const MOCK_PERMESSO: PermessoStatusResponse = {
	...MOCK_PERMESSO_EMPTY,
	practiceNumber: MOCK_PRACTICE_NUMBER,
	checkHours: [9],
}
export const MOCK_CHECK_STATUS = 'Ready for collection'
export const MOCK_CHECKED_AT = '2026-10-12T09:00:00Z'
export const MOCK_PERMESSO_CHECKED: PermessoStatusResponse = {
	...MOCK_PERMESSO,
	lastStatus: MOCK_CHECK_STATUS,
	lastCheckedAt: MOCK_CHECKED_AT,
}
export const MOCK_CHECK_RESULT: CheckResultResponse = {
	success: true,
	status: MOCK_CHECK_STATUS,
	error: null,
	checkedAt: MOCK_CHECKED_AT,
}
export const MOCK_PERMESSO_HISTORY: PermessoCheckHistoryResponse = [
	{
		id: '11111111-1111-4111-8111-111111111111',
		success: true,
		status: MOCK_PERMESSO_CHECKED.lastStatus,
		error: null,
		triggeredBy: 'manual',
		checkedAt: MOCK_CHECKED_AT,
	},
]
export async function mockPermessoResponse(
	page: Page,
	path: string,
	body: unknown,
	status = 200,
	method?: string,
) {
	await page.route(path, (route) => {
		if (method && route.request().method() !== method) return route.fallback()
		return route.fulfill({
			status,
			contentType: 'application/json',
			body: JSON.stringify(body),
		})
	})
}
export async function mockPermessoStatus(page: Page, body = MOCK_PERMESSO) {
	await mockPermessoResponse(page, API_PERMESSO, body, 200, 'GET')
}
export async function mockPermessoHistory(
	page: Page,
	body: PermessoCheckHistoryResponse = [],
) {
	await mockPermessoResponse(page, API_PERMESSO_HISTORY, body)
}
export async function mockTelegramEvent(
	page: Page,
	event: 'connected' | 'timeout',
) {
	await page.route(API_PERMESSO_LINK_EVENTS, (route) =>
		route.fulfill({
			contentType: 'text/event-stream',
			body: `event: ${event}\ndata: {}\n\n`,
		}),
	)
}
