export default defineContentScript({
	matches: ['*://*/*'],
	main() {
		const WEB_URL = import.meta.env.VITE_WEB_URL ?? 'http://localhost:5173'

		window.addEventListener('message', (event) => {
			// Only accept messages from the web app origin
			if (event.origin !== WEB_URL) return
			if (!event.data || event.data.type !== 'MY_TIME_CONNECT') return

			const { token } = event.data as { token: string }
			browser.runtime
				.sendMessage({ type: 'EXCHANGE_TOKEN', token })
				.then((response) => {
					window.postMessage(
						{
							type: 'MY_TIME_CONNECT_RESULT',
							success: (response as { success: boolean })?.success ?? false,
						},
						WEB_URL,
					)
				})
		})
	},
})
