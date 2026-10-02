import { syncBlockedSites } from '@/bll/siteBlocking/siteBlockingService'
import { EXTENSION_CONFIG } from '@/shared/config/extension-config'
import { handleMessage } from './messaging'

export default defineBackground(() => {
	// Sync blocked sites on service worker startup
	void syncBlockedSites()

	// On first install, send the user back to the web app's setup card.
	// A fresh tab matters: Chrome doesn't inject content scripts into tabs that
	// were already open at install time, so only a new tab can detect us.
	browser.runtime.onInstalled.addListener(({ reason }) => {
		if (reason !== 'install') return
		void browser.tabs.create({ url: EXTENSION_CONFIG.SITE_BLOCKING_PAGE_URL })
	})

	browser.runtime.onMessage.addListener(
		(message: unknown, _sender, sendResponse) => {
			return handleMessage(message, sendResponse)
		},
	)
})
