// BLL — site-blocking business logic.
// Orchestrates fetch → persist → apply DNR rules.
// Only calls DAL functions; never touches fetch() or chrome APIs directly.

import { fetchBlockedSitesRequest } from '@/dal/api/siteBlockingApi'
import { applyBlockRules, clearBlockRules } from '@/dal/dnrAdapter'
import {
	clearBlockedSites,
	getBlockedSites,
	setBlockedSites,
} from '@/dal/storage/siteBlockingRepository'
import { getTokens } from '@/dal/storage/tokenRepository'

/**
 * Pull the latest blocked sites from the API, persist them, and update DNR
 * rules. Returns the number of blocked sites after sync, or 0 if not
 * authenticated / on error.
 */
export async function syncBlockedSites(): Promise<number> {
	const tokens = await getTokens()
	if (!tokens) return 0

	const { data, error } = await fetchBlockedSitesRequest()
	if (error || !data) return 0

	await setBlockedSites(data)
	await applyBlockRules(data)

	return data.length
}

/** Read the locally cached list — no network call. */
export async function getCachedBlockedSites() {
	return getBlockedSites()
}

/** Clear stored sites and remove all DNR rules (used on sign-out). */
export async function clearSiteBlocking(): Promise<void> {
	await clearBlockedSites()
	await clearBlockRules()
}
