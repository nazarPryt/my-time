import { EXTENSION_CONFIG } from '@/shared/config/extension-config'
import type { ExtensionMessage, ExtensionResponse } from '@/shared/messages'

export default defineContentScript({
	matches: ['*://*/*'],
	main() {
		const WEB_URL = EXTENSION_CONFIG.WEB_URL

		// Announce presence to the web app as soon as the content script loads
		window.postMessage({ type: 'MY_TIME_READY' }, WEB_URL)

		window.addEventListener('message', (event) => {
			// Only accept messages from the web app origin
			if (event.origin !== WEB_URL) return
			if (!event.data) return

			if (event.data.type === 'MY_TIME_PING') {
				window.postMessage({ type: 'MY_TIME_PING_RESULT' }, WEB_URL)
				return
			}

			if (event.data.type === 'MY_TIME_CONNECT') {
				const { token } = event.data as { token: string }
				const message: ExtensionMessage = { type: 'EXCHANGE_TOKEN', token }

				browser.runtime.sendMessage(message).then((response) => {
					const res = response as Extract<
						ExtensionResponse,
						{ type: 'EXCHANGE_TOKEN' }
					>
					window.postMessage(
						{
							type: 'MY_TIME_CONNECT_RESULT',
							success: res?.success ?? false,
						},
						WEB_URL,
					)
				})
			}
		})
	},
})
