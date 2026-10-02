import type { Page } from '@playwright/test'

/**
 * Stand-in for the browser extension's content script
 * (`apps/extension/src/entrypoints/content/index.ts`). The web app only ever
 * talks to the extension through `window.postMessage`, so speaking the same
 * protocol from an init script exercises every extension state without
 * loading a real extension into Chromium:
 *
 *   page → ext   MY_TIME_PING              ext → page   MY_TIME_PING_RESULT
 *   page → ext   MY_TIME_CONNECT { token } ext → page   MY_TIME_CONNECT_RESULT
 *                                          ext → page   MY_TIME_READY (unprompted)
 *
 * Keep this in sync with the content script if the protocol changes.
 */
export interface FakeExtensionState {
	/**
	 * `false` = the content script isn't in the page yet (not installed, or
	 * installed after the tab was opened): pings go unanswered.
	 */
	installed: boolean
	/** Whether the extension holds tokens — `true` reports as "linked". */
	authenticated: boolean
	/** Manifest version. `null` mimics a build that predates version reporting. */
	version: string | null
	/** How the extension answers MY_TIME_CONNECT. `'silent'` never replies. */
	connectResult: 'success' | 'failure' | 'silent'
	/** Delay before answering a ping, to hold the page in "checking". */
	pingDelayMs: number
}

const DEFAULT_STATE: FakeExtensionState = {
	installed: true,
	authenticated: true,
	version: '0.2.0',
	connectResult: 'success',
	pingDelayMs: 0,
}

/** What the page sent to the extension, for assertions. */
export interface FakeExtensionLog {
	pings: number
	connectTokens: string[]
}

interface FakeExtensionHandle {
	state: FakeExtensionState
	log: FakeExtensionLog
}

declare global {
	interface Window {
		__fakeExtension?: FakeExtensionHandle
	}
}

/**
 * Registers the fake for every subsequent navigation (including reloads).
 * Calling it again before a reload replaces the state the next page load
 * starts with — e.g. "not installed" → reload → "installed".
 */
export async function installFakeExtension(
	page: Page,
	state: Partial<FakeExtensionState> = {},
) {
	await page.addInitScript(
		(initial: FakeExtensionState) => {
			// A later installFakeExtension() call adds a second init script; it
			// only swaps the state so there's still exactly one listener.
			if (window.__fakeExtension) {
				window.__fakeExtension.state = initial
				return
			}
			const handle: FakeExtensionHandle = {
				state: initial,
				log: { pings: 0, connectTokens: [] },
			}
			window.__fakeExtension = handle

			const reply = (message: Record<string, unknown>) =>
				window.postMessage(message, window.location.origin)
			const statusMessage = (type: string) => ({
				type,
				authenticated: handle.state.authenticated,
				...(handle.state.version === null
					? {}
					: { version: handle.state.version }),
			})

			window.addEventListener('message', (event) => {
				if (event.origin !== window.location.origin || !event.data) return
				const { state, log } = handle
				if (!state.installed) return

				if (event.data.type === 'MY_TIME_PING') {
					log.pings++
					setTimeout(
						() => reply(statusMessage('MY_TIME_PING_RESULT')),
						state.pingDelayMs,
					)
					return
				}

				if (event.data.type === 'MY_TIME_CONNECT') {
					log.connectTokens.push(event.data.token)
					if (state.connectResult === 'silent') return
					const success = state.connectResult === 'success'
					if (success) state.authenticated = true
					reply({ type: 'MY_TIME_CONNECT_RESULT', success })
				}
			})
		},
		{ ...DEFAULT_STATE, ...state },
	)
}

/** Changes the running fake's state without reloading (no message is sent). */
export async function setFakeExtensionState(
	page: Page,
	patch: Partial<FakeExtensionState>,
) {
	await page.evaluate((p) => {
		if (!window.__fakeExtension) throw new Error('fake extension not installed')
		Object.assign(window.__fakeExtension.state, p)
	}, patch)
}

/**
 * Simulates the content script arriving in an already-open tab (installed or
 * reloaded extension): marks it installed and posts MY_TIME_READY.
 */
export async function announceFakeExtension(
	page: Page,
	patch: Partial<FakeExtensionState> = {},
) {
	await page.evaluate((p) => {
		const handle = window.__fakeExtension
		if (!handle) throw new Error('fake extension not installed')
		Object.assign(handle.state, p, { installed: true })
		window.postMessage(
			{
				type: 'MY_TIME_READY',
				authenticated: handle.state.authenticated,
				...(handle.state.version === null
					? {}
					: { version: handle.state.version }),
			},
			window.location.origin,
		)
	}, patch)
}

export async function readFakeExtensionLog(page: Page) {
	return page.evaluate(() => {
		if (!window.__fakeExtension) throw new Error('fake extension not installed')
		return window.__fakeExtension.log
	})
}

/**
 * The page re-pings the extension when the tab becomes visible again (e.g.
 * after signing out in the popup). Headless tabs are always "visible", so
 * just fire the event.
 */
export async function simulateTabRefocus(page: Page) {
	await page.evaluate(() =>
		document.dispatchEvent(new Event('visibilitychange')),
	)
}
