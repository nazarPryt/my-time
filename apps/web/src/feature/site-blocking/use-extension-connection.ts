import { useCallback, useEffect, useState } from 'react'
import { generateExtensionToken } from './api'

const PING_TIMEOUT_MS = 300
const CONNECT_TIMEOUT_MS = 5000

export function useExtensionConnection() {
	const [connected, setConnected] = useState<boolean | null>(null)
	const [connecting, setConnecting] = useState(false)

	const check = useCallback(async () => {
		setConnected(null)
		const result = await new Promise<boolean>((resolve) => {
			const timer = setTimeout(() => {
				window.removeEventListener('message', handler)
				resolve(false)
			}, PING_TIMEOUT_MS)

			function handler(event: MessageEvent) {
				if (event.data?.type !== 'MY_TIME_PING_RESULT') return
				clearTimeout(timer)
				window.removeEventListener('message', handler)
				resolve(true)
			}

			window.addEventListener('message', handler)
			window.postMessage({ type: 'MY_TIME_PING' }, window.location.origin)
		})
		setConnected(result)
	}, [])

	async function connect() {
		if (connecting) return
		setConnecting(true)

		const { data, error } = await generateExtensionToken()
		if (error || !data) {
			setConnecting(false)
			setConnected(false)
			return
		}

		const result = await new Promise<boolean>((resolve) => {
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
		setConnected(result)
	}

	useEffect(() => {
		void check()

		// Extension announces itself when it loads into an already-open page
		function handleReady(event: MessageEvent) {
			if (event.data?.type === 'MY_TIME_READY') {
				setConnected(true)
			}
		}

		window.addEventListener('message', handleReady)
		return () => window.removeEventListener('message', handleReady)
	}, [check])

	return { connected, connecting, connect }
}
