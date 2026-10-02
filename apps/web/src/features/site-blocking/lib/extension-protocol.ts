// window.postMessage protocol between this page and the extension's content
// script (apps/extension/src/entrypoints/content/index.ts). Keep both sides
// in sync when changing a message.
export const EXTENSION_MESSAGE = {
	/** page → extension: are you there? */
	ping: 'MY_TIME_PING',
	/** extension → page: reply to a ping */
	pingResult: 'MY_TIME_PING_RESULT',
	/** extension → page: sent unprompted when the content script loads */
	ready: 'MY_TIME_READY',
	/** page → extension: sign in with this one-time token */
	connect: 'MY_TIME_CONNECT',
	/** extension → page: reply to a connect */
	connectResult: 'MY_TIME_CONNECT_RESULT',
} as const

/** Payload of `pingResult` and `ready`. */
export interface ExtensionStatusReply {
	type: string
	authenticated?: boolean
	/** Absent on builds that predate version reporting. */
	version?: string
}

/** Payload of `connectResult`. */
export interface ExtensionConnectReply {
	type: string
	success?: boolean
}
