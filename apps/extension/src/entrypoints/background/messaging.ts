// Background — typed message handlers.
// Calls BLL services only; never touches DAL or chrome APIs directly.

import { exchangeToken } from '@/bll/auth/authService'
import { syncBlockedSites } from '@/bll/siteBlocking/siteBlockingService'
import type { ExtensionMessage, ExtensionResponse } from '@/shared/messages'

type SendResponse = (response: ExtensionResponse) => void

export function handleMessage(
	message: unknown,
	sendResponse: SendResponse,
): boolean | undefined {
	if (!message || typeof message !== 'object') return

	const msg = message as ExtensionMessage

	if (msg.type === 'SYNC') {
		syncBlockedSites().then((count) => {
			sendResponse({ type: 'SYNC', count })
		})
		return true // keep channel open for async response
	}

	if (msg.type === 'EXCHANGE_TOKEN') {
		exchangeToken(msg.token).then(async ({ success }) => {
			if (success) {
				await syncBlockedSites()
			}
			sendResponse({ type: 'EXCHANGE_TOKEN', success })
		})
		return true // keep channel open for async response
	}
}
