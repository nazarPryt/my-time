import { useCallback, useEffect, useState } from 'react'
import { generateExtensionToken } from '../api/api'

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

type StatusMessage = { type: string; authenticated?: boolean }

function statusFrom(data: StatusMessage): ExtensionStatus {
	return data.authenticated === true ? 'linked' : 'not-linked'
}

export function useExtensionConnection() {
	const [status, setStatus] = useState<ExtensionStatus>('checking')
	const [connecting, setConnecting] = useState(false)
	const [connectFailed, setConnectFailed] = useState(false)

	const check = useCallback(async () => {
		const result = await new Promise<ExtensionStatus>((resolve) => {
			const timer = setTimeout(() => {
				window.removeEventListener('message', handler)
				resolve('not-installed')
			}, PING_TIMEOUT_MS)

			function handler(event: MessageEvent<StatusMessage>) {
				if (event.data?.type !== 'MY_TIME_PING_RESULT') return
				clearTimeout(timer)
				window.removeEventListener('message', handler)
				resolve(statusFrom(event.data))
			}

			window.addEventListener('message', handler)
			window.postMessage({ type: 'MY_TIME_PING' }, window.location.origin)
		})
		setStatus(result)
	}, [])

	async function connect() {
		if (connecting) return
		setConnecting(true)
		setConnectFailed(false)

		const { data, error } = await generateExtensionToken()
		if (error || !data) {
			setConnecting(false)
			setConnectFailed(true)
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

		setConnecting(false)
		setConnectFailed(!success)
		if (success) setStatus('linked')
	}

	useEffect(() => {
		void check()

		// Extension announces itself when it loads into an already-open page
		function handleReady(event: MessageEvent<StatusMessage>) {
			if (event.data?.type === 'MY_TIME_READY') {
				setStatus(statusFrom(event.data))
			}
		}

		// Re-check when the user returns to the tab — e.g. after signing out in
		// the extension popup, or after installing in another tab.
		function handleVisibility() {
			if (document.visibilityState === 'visible') void check()
		}

		window.addEventListener('message', handleReady)
		document.addEventListener('visibilitychange', handleVisibility)
		return () => {
			window.removeEventListener('message', handleReady)
			document.removeEventListener('visibilitychange', handleVisibility)
		}
	}, [check])

	return { status, connecting, connectFailed, connect }
}
