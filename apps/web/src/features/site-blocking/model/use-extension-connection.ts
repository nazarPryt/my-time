import { EXTENSION_VERSION } from 'contracts'
import { useEffect } from 'react'
import { create } from 'zustand'
import { generateExtensionToken } from '../api/api'
import { isOlderVersion } from '../lib/is-older-version'

const PING_TIMEOUT_MS = 300
const CONNECT_TIMEOUT_MS = 5000

// checking     → waiting for the ping reply
// not-installed → no content script answered
// not-linked   → extension answered but holds no tokens for this account
// linked       → extension is signed in and enforcing the block list
export type ExtensionStatus =
	| 'checking'
	| 'not-installed'
	| 'not-linked'
	| 'linked'

type StatusMessage = { type: string; authenticated?: boolean; version?: string }

interface ExtensionState {
	status: ExtensionStatus
	// null when not installed, or when the extension predates version reporting
	installedVersion: string | null
	connecting: boolean
	connectFailed: boolean
	check: () => Promise<void>
	connect: () => Promise<void>
}

function applyStatus(data: StatusMessage) {
	return {
		status: (data.authenticated === true
			? 'linked'
			: 'not-linked') as ExtensionStatus,
		installedVersion: data.version ?? null,
	}
}

// A store (not per-component state) so the sidebar's update dot and the Site
// Blocking page share one ping and always agree.
const useExtensionStore = create<ExtensionState>((set, get) => ({
	status: 'checking',
	installedVersion: null,
	connecting: false,
	connectFailed: false,

	check: async () => {
		const reply = await new Promise<StatusMessage | null>((resolve) => {
			const timer = setTimeout(() => {
				window.removeEventListener('message', handler)
				resolve(null)
			}, PING_TIMEOUT_MS)

			function handler(event: MessageEvent<StatusMessage>) {
				if (event.data?.type !== 'MY_TIME_PING_RESULT') return
				clearTimeout(timer)
				window.removeEventListener('message', handler)
				resolve(event.data)
			}

			window.addEventListener('message', handler)
			window.postMessage({ type: 'MY_TIME_PING' }, window.location.origin)
		})
		set(
			reply
				? applyStatus(reply)
				: { status: 'not-installed', installedVersion: null },
		)
	},

	connect: async () => {
		if (get().connecting) return
		set({ connecting: true, connectFailed: false })

		const { data, error } = await generateExtensionToken()
		if (error || !data) {
			set({ connecting: false, connectFailed: true })
			return
		}

		const success = await new Promise<boolean>((resolve) => {
			const timer = setTimeout(() => {
				window.removeEventListener('message', handler)
				resolve(false)
			}, CONNECT_TIMEOUT_MS)

			function handler(event: MessageEvent) {
				if (event.data?.type !== 'MY_TIME_CONNECT_RESULT') return
				clearTimeout(timer)
				window.removeEventListener('message', handler)
				resolve(event.data.success === true)
			}

			window.addEventListener('message', handler)
			window.postMessage(
				{ type: 'MY_TIME_CONNECT', token: data.token },
				window.location.origin,
			)
		})

		set({ connecting: false, connectFailed: !success })
		if (success) set({ status: 'linked' })
	},
}))

// Window listeners live for the whole app session, so they're attached once
// no matter how many components use the hook.
let watching = false

function startWatching() {
	if (watching) return
	watching = true
	const { check } = useExtensionStore.getState()
	void check()

	// Extension announces itself when it loads into an already-open page
	window.addEventListener('message', (event: MessageEvent<StatusMessage>) => {
		if (event.data?.type === 'MY_TIME_READY') {
			useExtensionStore.setState(applyStatus(event.data))
		}
	})

	// Re-check when the user returns to the tab — e.g. after signing out in
	// the extension popup, or after installing in another tab.
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible') void check()
	})
}

export function useExtensionConnection() {
	useEffect(startWatching, [])

	const state = useExtensionStore()
	const installed = state.status === 'not-linked' || state.status === 'linked'
	// An installed extension without a version predates version reporting,
	// so it's older than any release that has it.
	const updateAvailable =
		installed &&
		(state.installedVersion === null ||
			isOlderVersion(state.installedVersion, EXTENSION_VERSION))

	return { ...state, updateAvailable, latestVersion: EXTENSION_VERSION }
}
