import { fetchBlockedSites } from '../utils/api'
import { getTokens } from '../utils/auth'

async function syncBlockedSites(): Promise<number> {
	const tokens = await getTokens()
	if (!tokens) return 0

	const { data, error } = await fetchBlockedSites()
	if (error || !data) return 0

	// Build declarativeNetRequest rules — one rule per domain
	const addRules: chrome.declarativeNetRequest.Rule[] = data.map(
		(site, index) => ({
			id: index + 1,
			priority: 1,
			action: { type: 'block' as chrome.declarativeNetRequest.RuleActionType },
			condition: {
				urlFilter: `||${site.domain}`,
				resourceTypes: [
					'main_frame',
					'sub_frame',
					'xmlhttprequest',
					'other',
				] as chrome.declarativeNetRequest.ResourceType[],
			},
		}),
	)

	// Remove all existing dynamic rules then add fresh ones
	const existingRules = await chrome.declarativeNetRequest.getDynamicRules()
	const removeRuleIds = existingRules.map((r) => r.id)

	await chrome.declarativeNetRequest.updateDynamicRules({
		removeRuleIds,
		addRules,
	})

	// Persist the synced list for the popup to read
	await browser.storage.local.set({ blocked_sites: data })

	return data.length
}

export default defineBackground(() => {
	// Sync on startup
	void syncBlockedSites()

	// Listen for SYNC message from popup
	browser.runtime.onMessage.addListener(
		(message: unknown, _sender, sendResponse) => {
			if (
				message &&
				typeof message === 'object' &&
				(message as { type: string }).type === 'SYNC'
			) {
				syncBlockedSites().then((count) => sendResponse({ count }))
				return true // keep message channel open for async response
			}
		},
	)
})
