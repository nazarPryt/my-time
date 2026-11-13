// Standalone entry, used only by index.html when running the remote on its
// own (`bun --filter english-quiz dev`). The host never loads this file — it
// loads `./mount` through Module Federation instead.
import { mount } from './mount'

const container = document.getElementById('app')
if (container) {
	mount(container, {
		onEvent: (event) => console.info('[english-quiz]', event),
		onError: (error) => console.error('[english-quiz]', error),
	})
}
