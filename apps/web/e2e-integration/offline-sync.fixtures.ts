import type { APIRequestContext } from '@playwright/test'
import { OfflineSessionSchema } from 'contracts'
import { formatISO, subMinutes } from 'date-fns'
import { INTEGRATION_DESKTOP_URL } from '../../../scripts/e2e-integration-config'
import { test as base, type DesktopState } from './desktop-sync.fixtures'

export interface OfflineDesktopState extends DesktopState {
	pid: number
	online: boolean
	pending: number
	committedUploads: number
	pendingSessions: number
	syncingOffline?: boolean
	lastSuccessfulSyncAt: string | null
	journalRunning: ReturnType<typeof OfflineSessionSchema.parse> | null
}

export async function connectOfflineDesktop(
	request: APIRequestContext,
	credentials: { email: string; password: string },
	now: Date,
) {
	const response = await request.post(
		`${INTEGRATION_DESKTOP_URL}/offline/connect`,
		{ data: { credentials, online: false, now: formatISO(now) } },
	)
	if (!response.ok())
		throw new Error(
			`Offline desktop failed to initialize: ${await response.text()}`,
		)
	const { id } = await response.json()
	async function action(
		name: string,
		data?: unknown,
	): Promise<OfflineDesktopState> {
		const response = await request.post(
			`${INTEGRATION_DESKTOP_URL}/offline/${id}/${name}`,
			{ data },
		)
		if (!response.ok())
			throw new Error(
				`Offline desktop ${name} failed: ${await response.text()}`,
			)
		const state = await response.json()
		return {
			...state,
			journalRunning: state.journalRunning
				? OfflineSessionSchema.parse(state.journalRunning)
				: null,
		}
	}
	return {
		state: () => action('state'),
		start: () => action('start'),
		stop: () => action('stop'),
		restart: () => action('restart'),
		setClock: (now: Date) => action('clock', { now: formatISO(now) }),
		setOnline: (online: boolean) => action('network', { online }),
		loseNextResponse: () => action('lose-response'),
		switchAccount: (credentials: { email: string; password: string }) =>
			action('account', credentials),
		dispose: () => action('dispose'),
	}
}

export const test = base.extend<{
	offlineDesktop: Awaited<ReturnType<typeof connectOfflineDesktop>>
}>({
	offlineDesktop: async ({ request, account }, use) => {
		const desktop = await connectOfflineDesktop(
			request,
			account.credentials,
			subMinutes(new Date(), 35),
		)
		try {
			await use(desktop)
		} finally {
			await desktop.dispose()
		}
	},
})
export { expect } from '@playwright/test'
