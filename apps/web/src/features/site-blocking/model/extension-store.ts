import { create } from 'zustand'
import { generateExtensionToken } from '../api/api'
import { CONNECT_TIMEOUT_MS, PING_TIMEOUT_MS } from '../config/extension'
import {
	EXTENSION_MESSAGE,
	type ExtensionConnectReply,
	type ExtensionStatusReply,
} from '../lib/extension-protocol'
import {
	type ExtensionSnapshot,
	snapshotFromReply,
} from '../lib/extension-status'
import { postAndAwaitReply } from '../lib/request-reply'

interface ExtensionState extends ExtensionSnapshot {
	connecting: boolean
	connectFailed: boolean
	check: () => Promise<void>
	connect: () => Promise<void>
	/** Applies an unprompted status message (MY_TIME_READY). */
	applyReply: (reply: ExtensionStatusReply) => void
}

// A store (not per-component state) so the sidebar's update dot and the Site
// Blocking page share one ping and always agree.
export const useExtensionStore = create<ExtensionState>((set, get) => ({
	status: 'checking',
	installedVersion: null,
	connecting: false,
	connectFailed: false,

	check: async () => {
		const reply = await postAndAwaitReply<ExtensionStatusReply>(
			window,
			{ type: EXTENSION_MESSAGE.ping },
			EXTENSION_MESSAGE.pingResult,
			PING_TIMEOUT_MS,
		)
		set(snapshotFromReply(reply))
	},

	connect: async () => {
		if (get().connecting) return
		set({ connecting: true, connectFailed: false })

		const { data, error } = await generateExtensionToken()
		if (error || !data) {
			set({ connecting: false, connectFailed: true })
			return
		}

		const reply = await postAndAwaitReply<ExtensionConnectReply>(
			window,
			{ type: EXTENSION_MESSAGE.connect, token: data.token },
			EXTENSION_MESSAGE.connectResult,
			CONNECT_TIMEOUT_MS,
		)
		const success = reply?.success === true
		set({
			connecting: false,
			connectFailed: !success,
			...(success && { status: 'linked' }),
		})
	},

	applyReply: (reply) => set(snapshotFromReply(reply)),
}))
