import type { Page } from '@playwright/test'

/** Every request the browser makes for the remote's files. */
export const REMOTE_ASSETS = '**/remotes/english-quiz/**'

/** Simulates the remote's server being down; undo with restoreRemote. */
export async function mockRemoteOutage(page: Page) {
	await page.route(REMOTE_ASSETS, (route) => route.fulfill({ status: 503 }))
}

export async function restoreRemote(page: Page) {
	await page.unroute(REMOTE_ASSETS)
}
