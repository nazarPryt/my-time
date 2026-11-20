// Standalone entry, used only by index.html when running the remote on its
// own (`bun --filter english-quiz dev`). The host never loads this file — it
// loads `./mount` through Module Federation instead.
import type { EnglishQuizEvent } from '@my-time/mfe-contracts'
import { devApiFetch } from './dev/dev-api-fetch'
import { mount } from './mount'

const container = document.getElementById('app')
if (container) {
	const remote = mount(container, { apiFetch: devApiFetch, onEvent, onError })

	// Stands in for the host, which would update the URL.
	function onEvent(event: EnglishQuizEvent) {
		console.info('[english-quiz]', event)
		if (event.type === 'mode-changed') {
			remote.update({
				apiFetch: devApiFetch,
				mode: event.mode ?? undefined,
				onEvent,
				onError,
			})
		}
	}

	function onError(error: Error) {
		console.error('[english-quiz]', error)
	}
}
