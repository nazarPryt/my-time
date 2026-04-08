// DAL — sole owner of chrome.storage.local for blocked sites.

import type { BlockedSiteResponse } from 'contracts'

const STORAGE_KEY = 'blocked_sites'

export async function getBlockedSites(): Promise<BlockedSiteResponse[]> {
	const result = await browser.storage.local.get(STORAGE_KEY)
	const sites = result[STORAGE_KEY]
	return Array.isArray(sites) ? (sites as BlockedSiteResponse[]) : []
}

export async function setBlockedSites(
	sites: BlockedSiteResponse[],
): Promise<void> {
	await browser.storage.local.set({ [STORAGE_KEY]: sites })
}

export async function clearBlockedSites(): Promise<void> {
	await browser.storage.local.remove(STORAGE_KEY)
}
