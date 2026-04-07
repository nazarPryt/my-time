import { exchangeExtensionToken, fetchBlockedSites } from '@/utils/api'
import { getTokens, setTokens } from '@/utils/auth'

async function syncBlockedSites(): Promise<number> {
	const tokens = await getTokens()
	if (!tokens) return 0

	const { data, error } = await fetchBlockedSites()
	if (error || !data) return 0

	// Build declarativeNetRequest rules — two rules per domain:
	//   1. main_frame → redirect to our block page (shows beautiful UI)
	//   2. everything else → silently block (prevents XHR/sub-resource leaks)
	const addRules: chrome.declarativeNetRequest.Rule[] = data.flatMap(
		(site, index) => [
			{
				id: index * 2 + 1,
				priority: 1,
				action: {
					type: 'redirect' as chrome.declarativeNetRequest.RuleActionType,
					redirect: {
						extensionPath: `/block.html?domain=${encodeURIComponent(site.domain)}`,
					},
				},
				condition: {
					urlFilter: `||${site.domain}`,
					resourceTypes: ['main_frame'] as chrome.declarativeNetRequest.ResourceType[],
				},
			},
			{
				id: index * 2 + 2,
				priority: 1,
				action: { type: 'block' as chrome.declarativeNetRequest.RuleActionType },
				condition: {
					urlFilter: `||${site.domain}`,
					resourceTypes: [
						'sub_frame',
						'xmlhttprequest',
						'other',
					] as chrome.declarativeNetRequest.ResourceType[],
				},
			},
		],
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

	// Listen for messages from popup and content scripts
	browser.runtime.onMessage.addListener(
		(message: unknown, _sender, sendResponse) => {
			if (!message || typeof message !== 'object') return
			const msg = message as { type: string; token?: string }

			if (msg.type === 'SYNC') {
				syncBlockedSites().then((count) => sendResponse({ count }))
				return true // keep message channel open for async response
			}

			if (msg.type === 'EXCHANGE_TOKEN' && msg.token) {
				exchangeExtensionToken(msg.token).then(async ({ data, error }) => {
					if (data && !error) {
						await setTokens(data.accessToken, data.refreshToken)
						void syncBlockedSites()
						sendResponse({ success: true })
					} else {
						sendResponse({ success: false })
					}
				})
				return true // keep message channel open for async response
			}
		},
	)
})
