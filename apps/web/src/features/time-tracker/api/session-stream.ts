import { SessionStreamParser } from '@my-time/session-sync'
import {
	API_PREFIX,
	type DesktopPresence,
	type SessionResponse,
	TIME_TRACKER_ROUTES,
	type TimerSnapshot,
} from 'contracts'
import { WEB_CONFIG } from '@/shared/config/web-config'
import { fetchStreamWithRefresh } from '@/shared/lib/fetch-with-refresh'
import { tokenStorage } from '@/shared/lib/token-storage'

const EVENTS_URL = `${WEB_CONFIG.API_URL}${API_PREFIX}${TIME_TRACKER_ROUTES.prefix}${TIME_TRACKER_ROUTES.events}`
export class SessionAuthenticationError extends Error {}

export async function watchSessions(
	signal: AbortSignal,
	onSession: (session: SessionResponse | null, timer?: TimerSnapshot) => void,
	onDesktopPresence?: (presence: DesktopPresence) => void,
): Promise<void> {
	const token = tokenStorage.getAccessToken()
	if (!token)
		throw new SessionAuthenticationError(
			'Please sign in again to receive session updates.',
		)
	const controller = new AbortController()
	const combined = AbortSignal.any([signal, controller.signal])
	let watchdog: ReturnType<typeof setTimeout> | undefined
	const armWatchdog = () => {
		clearTimeout(watchdog)
		watchdog = setTimeout(() => controller.abort(), 60_000)
	}
	let reader: ReadableStreamDefaultReader<Uint8Array> | undefined
	try {
		const response = await fetchStreamWithRefresh(EVENTS_URL, {
			headers: {
				authorization: `Bearer ${token}`,
				accept: 'text/event-stream',
				'X-My-Time-Client': 'web',
			},
			signal: combined,
			redirect: 'error',
			cache: 'no-store',
		})
		if (response.status === 401 || response.status === 403) {
			await response.body?.cancel()
			throw new SessionAuthenticationError(
				'Please sign in again to receive session updates.',
			)
		}
		if (
			!response.ok ||
			!response.body ||
			!/^text\/event-stream(?:;|$)/i.test(
				response.headers.get('content-type') ?? '',
			)
		) {
			await response.body?.cancel()
			throw new Error('Unable to connect to session updates.')
		}
		reader = response.body.getReader()
		const parser = new SessionStreamParser(onSession, onDesktopPresence)
		armWatchdog()
		while (!combined.aborted) {
			const { done, value } = await reader.read()
			combined.throwIfAborted()
			if (done) return
			armWatchdog()
			parser.push(value)
		}
	} finally {
		clearTimeout(watchdog)
		controller.abort()
		await reader?.cancel().catch(() => {})
		reader?.releaseLock()
	}
}
