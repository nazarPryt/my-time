import { syncBlockedSites } from '@/bll/siteBlocking/siteBlockingService'
import { EXTENSION_CONFIG } from '@/shared/config/extension-config'
import { handleMessage } from './messaging'

export default defineBackground(() => {
	// Sync blocked sites on service worker startup
	void syncBlockedSites()

	// On first install, send the user back to the web app's setup card.
	// A fresh tab matters: Chrome doesn't inject content scripts into tabs that
	// were already open at install time, so only a new tab can detect us.
	browser.runtime.onInstalled.addListener(({ reason, previousVersion }) => {
		if (reason === 'install') {
			void browser.tabs.create({ url: EXTENSION_CONFIG.SITE_BLOCKING_PAGE_URL })
		}
		// After an update, open web app tabs still run the old, now-dead content
		// script. Reloading them injects the new one, so the "update available"
		// prompt clears without the user doing anything. The version check skips
		// plain reloads (e.g. every rebuild during `wxt dev`).
		const currentVersion = browser.runtime.getManifest().version
		if (reason === 'update' && previousVersion !== currentVersion) {
			void reloadWebAppTabs()
		}
	})

	browser.runtime.onMessage.addListener(
		(message: unknown, _sender, sendResponse) => {
			return handleMessage(message, sendResponse)
		},
	)
})

async function reloadWebAppTabs() {
	// Filter by prefix rather than a `url` match pattern — match patterns don't
	// reliably handle ports like localhost:5173. Reading tab.url is allowed by
	// our <all_urls> host permission.
	const tabs = await browser.tabs.query({})
	for (const tab of tabs) {
		if (tab.id !== undefined && tab.url?.startsWith(EXTENSION_CONFIG.WEB_URL)) {
			void browser.tabs.reload(tab.id)
		}
	}
}
