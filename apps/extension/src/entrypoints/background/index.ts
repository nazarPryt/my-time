import { syncBlockedSites } from '@/bll/siteBlocking/siteBlockingService'
import { handleMessage } from './messaging'

export default defineBackground(() => {
	// Sync blocked sites on service worker startup
	void syncBlockedSites()

	browser.runtime.onMessage.addListener(
		(message: unknown, _sender, sendResponse) => {
			return handleMessage(message, sendResponse)
		},
	)
})
