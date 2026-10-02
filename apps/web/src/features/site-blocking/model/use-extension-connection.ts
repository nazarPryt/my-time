import { EXTENSION_VERSION } from 'contracts'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import {
	EXTENSION_MESSAGE,
	type ExtensionStatusReply,
} from '../lib/extension-protocol'
import { isUpdateAvailable } from '../lib/extension-status'
import { isOwnMessage } from '../lib/request-reply'
import { useExtensionStore } from './extension-store'

// Window listeners live for the whole app session, so they're attached once
// no matter how many components use the hooks below.
let watching = false

function startWatching() {
	if (watching) return
	watching = true
	const { check, applyReply } = useExtensionStore.getState()
	void check()

	// Extension announces itself when it loads into an already-open page
	window.addEventListener('message', (event) => {
		if (
			isOwnMessage<ExtensionStatusReply>(window, event, EXTENSION_MESSAGE.ready)
		) {
			applyReply(event.data)
		}
	})

	// Re-check when the user returns to the tab — e.g. after signing out in
	// the extension popup, or after installing in another tab.
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible') void check()
	})
}

/** Everything the Site Blocking page needs to show and drive the extension. */
export function useExtensionConnection() {
	useEffect(startWatching, [])

	const state = useExtensionStore(
		useShallow((s) => ({
			status: s.status,
			installedVersion: s.installedVersion,
			connecting: s.connecting,
			connectFailed: s.connectFailed,
			connect: s.connect,
		})),
	)

	return {
		...state,
		updateAvailable: isUpdateAvailable(state, EXTENSION_VERSION),
		latestVersion: EXTENSION_VERSION,
	}
}

/** Narrow subscription for the sidebar dot — re-renders only when it flips. */
export function useExtensionUpdateAvailable() {
	useEffect(startWatching, [])
	return useExtensionStore((s) => isUpdateAvailable(s, EXTENSION_VERSION))
}
