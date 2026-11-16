import { type Component, defineAsyncComponent } from 'vue'

/** Avoids flashing the skeleton on fast loads. */
const LOADING_DELAY_MS = 200

/** Downloads the mode's code only when it is first opened. */
export function lazyModeComponent(
	loader: () => Promise<{ default: Component }>,
	skeleton: Component,
): Component {
	return defineAsyncComponent({
		loader,
		loadingComponent: skeleton,
		delay: LOADING_DELAY_MS,
	})
}
