import { reconnectSessions } from '@my-time/session-sync'
import type { SessionResponse } from 'contracts'
import {
	SessionAuthenticationError,
	watchSessions,
} from '../api/session-stream'
import {
	observeSessionResume,
	scheduleMidnight,
	waitForRetry,
} from '../lib/browser-lifecycle'
import type { TimeTrackerState } from './types'

type SyncActions = Pick<
	TimeTrackerState,
	| 'applyDesktopPresence'
	| 'beginSync'
	| 'endSync'
	| 'applySnapshot'
	| 'refreshSummary'
	| 'disconnectStream'
	| 'syncFailed'
>

/** Own one mounted tracker's connection, summary schedule, and browser listeners. */
export function startTimeTrackerSync(actions: SyncActions): () => void {
	const lifetime = new AbortController()
	let connection = new AbortController()
	let terminal = false

	function isAuthenticationError(error: unknown): boolean {
		return error instanceof SessionAuthenticationError
	}

	async function watch(
		onSession: (session: SessionResponse | null) => void,
	): Promise<void> {
		connection = new AbortController()
		const signal = AbortSignal.any([lifetime.signal, connection.signal])
		await watchSessions(signal, onSession, (presence) => {
			if (!signal.aborted) actions.applyDesktopPresence(presence.connected)
		})
	}

	function handleSnapshot(session: SessionResponse | null): void {
		actions.applySnapshot(session)
		void actions.refreshSummary(lifetime.signal)
	}

	function handleDisconnect(error: unknown): void {
		actions.disconnectStream()
		terminal = isAuthenticationError(error)
		if (connection.signal.aborted && !terminal) return
		const message = terminal
			? 'Please sign in again to receive session updates.'
			: 'Session updates disconnected. Reconnecting…'
		actions.syncFailed(message)
	}

	function reconnect(): void {
		if (!terminal) connection.abort()
	}

	actions.beginSync(lifetime.signal)
	const stopMidnight = scheduleMidnight(() => {
		void actions.refreshSummary(lifetime.signal)
	})
	const stopResume = observeSessionResume(reconnect)
	void reconnectSessions({
		watch,
		onSession: handleSnapshot,
		onDisconnected: handleDisconnect,
		isAuthenticationError,
		isStopped: () => lifetime.signal.aborted,
		wait: (milliseconds) =>
			waitForRetry(
				milliseconds,
				AbortSignal.any([lifetime.signal, connection.signal]),
			),
	})

	return () => {
		lifetime.abort()
		stopMidnight()
		stopResume()
		actions.endSync()
	}
}
