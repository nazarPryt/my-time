import { type APIRequestContext, test as base } from '@playwright/test'
import { API_PREFIX, AUTH_ROUTES } from 'contracts'
import {
	INTEGRATION_API_URL as API_URL,
	INTEGRATION_DESKTOP_URL as DESKTOP_URL,
} from '../../../scripts/e2e-integration-config'
import { TimeTrackerPage } from '../e2e/dashboard/time-tracker/TimeTrackerPage'
import { ACCESS_TOKEN_KEY } from '../src/shared/lib/token-storage'
export { API_URL }
export interface DesktopState {
	status: string
	activeSession: { id: string } | null
	dailySeconds: number | null
}
export async function createAccount(request: APIRequestContext) {
	const credentials = {
		email: `integration-${crypto.randomUUID()}@example.com`,
		password: 'integration-password',
	}
	const response = await request.post(
		`${API_URL}${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.register}`,
		{ data: { ...credentials, name: 'Integration account' } },
	)
	if (!response.ok())
		throw new Error(`Account registration failed: ${response.status()}`)
	const { tokens } = await response.json()
	return { credentials, accessToken: tokens.accessToken as string }
}
export async function connectDesktop(
	request: APIRequestContext,
	credentials: { email: string; password: string },
) {
	const response = await request.post(`${DESKTOP_URL}/connect`, {
		data: credentials,
	})
	if (!response.ok())
		throw new Error(`Desktop authentication failed: ${response.status()}`)
	const { id } = await response.json()
	return {
		state: async (): Promise<DesktopState> =>
			(await request.get(`${DESKTOP_URL}/${id}/state`)).json(),
		start: async () => {
			await request.post(`${DESKTOP_URL}/${id}/start`)
		},
		stop: async () => {
			await request.post(`${DESKTOP_URL}/${id}/stop`)
		},
		disconnect: async () => {
			await request.post(`${DESKTOP_URL}/${id}/disconnect`)
		},
		resume: async () => {
			await request.post(`${DESKTOP_URL}/${id}/resume`)
		},
		dispose: async () => {
			await request.post(`${DESKTOP_URL}/${id}/dispose`)
		},
	}
}
export const test = base.extend<{
	account: Awaited<ReturnType<typeof createAccount>>
	desktop: Awaited<ReturnType<typeof connectDesktop>>
	trackerPage: TimeTrackerPage
}>({
	account: async ({ request }, use) => {
		await use(await createAccount(request))
	},
	desktop: async ({ request, account }, use) => {
		const desktop = await connectDesktop(request, account.credentials)
		try {
			await use(desktop)
		} finally {
			await desktop.dispose()
		}
	},
	trackerPage: async ({ page, account }, use) => {
		await page.addInitScript(
			({ key, token }) => localStorage.setItem(key, token),
			{ key: ACCESS_TOKEN_KEY, token: account.accessToken },
		)
		await use(new TimeTrackerPage(page))
	},
})
export { expect } from '@playwright/test'
