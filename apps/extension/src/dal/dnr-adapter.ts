// DAL — sole owner of declarativeNetRequest.
// Converts a list of domains into DNR rules and applies them atomically.
// Uses the `browser` global provided by WXT (cross-browser compatible).

import type { BlockedSiteResponse } from 'contracts'
import type { Browser } from 'wxt/browser'

type Rule = Browser.declarativeNetRequest.Rule

function buildRules(sites: BlockedSiteResponse[]): Rule[] {
	return sites.flatMap((site, index) => [
		{
			id: index * 2 + 1,
			priority: 1,
			action: {
				type: 'redirect' as Browser.declarativeNetRequest.RuleActionType,
				redirect: {
					extensionPath: `/block.html?domain=${encodeURIComponent(site.domain)}`,
				},
			},
			condition: {
				urlFilter: `||${site.domain}`,
				resourceTypes: [
					'main_frame',
				] as Browser.declarativeNetRequest.ResourceType[],
			},
		},
		{
			id: index * 2 + 2,
			priority: 1,
			action: {
				type: 'block' as Browser.declarativeNetRequest.RuleActionType,
			},
			condition: {
				urlFilter: `||${site.domain}`,
				resourceTypes: [
					'sub_frame',
					'xmlhttprequest',
					'other',
				] as Browser.declarativeNetRequest.ResourceType[],
			},
		},
	])
}

/** Replace all dynamic DNR rules with rules derived from `sites`. */
export async function applyBlockRules(
	sites: BlockedSiteResponse[],
): Promise<void> {
	const existing = await browser.declarativeNetRequest.getDynamicRules()
	const removeRuleIds = existing.map((r) => r.id)
	await browser.declarativeNetRequest.updateDynamicRules({
		removeRuleIds,
		addRules: buildRules(sites),
	})
}

/** Remove all dynamic DNR rules (used on sign-out). */
export async function clearBlockRules(): Promise<void> {
	const existing = await browser.declarativeNetRequest.getDynamicRules()
	const removeRuleIds = existing.map((r) => r.id)
	await browser.declarativeNetRequest.updateDynamicRules({
		removeRuleIds,
		addRules: [],
	})
}
