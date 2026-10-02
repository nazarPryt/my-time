import { API_PREFIX, PERMESSO_ROUTES } from 'contracts'
import { WEB_CONFIG } from '@/shared/config/web-config'
import { tokenStorage } from '@/shared/lib/token-storage'

const EVENTS_URL = `${WEB_CONFIG.API_URL}${API_PREFIX}${PERMESSO_ROUTES.prefix}${PERMESSO_ROUTES.telegramLinkEvents}`

type TelegramLinkOutcome = 'connected' | 'timeout'

function readEventName(message: string): string | undefined {
	return message
		.split('\n')
		.find((line) => line.startsWith('event:'))
		?.slice('event:'.length)
		.trim()
}

/**
 * Opens the SSE connection and resolves once the server reports the
 * Telegram link is either 'connected' or has 'timeout'd out — whichever the
 * stream sends first. Ends the connection either way.
 */
export async function watchTelegramLink(
	signal: AbortSignal,
): Promise<TelegramLinkOutcome> {
	const token = tokenStorage.getAccessToken()
	const response = await fetch(EVENTS_URL, {
		headers: token ? { authorization: `Bearer ${token}` } : {},
		credentials: 'include',
		signal,
	})

	if (!response.ok || !response.body) return 'timeout'

	const reader = response.body.getReader()
	const decoder = new TextDecoder()
	let buffer = ''

	try {
		while (true) {
			const { done, value } = await reader.read()
			if (done) return 'timeout'

			buffer += decoder.decode(value, { stream: true })
			const messages = buffer.split('\n\n')
			buffer = messages.pop() ?? ''

			for (const message of messages) {
				const event = readEventName(message)
				if (event === 'connected' || event === 'timeout') return event
			}
		}
	} finally {
		reader.cancel().catch(() => {})
	}
}
