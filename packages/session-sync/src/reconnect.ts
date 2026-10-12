import type { SessionResponse, TimerSnapshot } from 'contracts'
import { reconnectDelay } from './retry'

export interface SessionReconnectOptions {
	watch(
		onSession: (session: SessionResponse | null, timer?: TimerSnapshot) => void,
	): Promise<void>
	onSession(session: SessionResponse | null, timer?: TimerSnapshot): void
	onDisconnected(error: unknown): void
	isAuthenticationError(error: unknown): boolean
	isStopped(): boolean
	wait(milliseconds: number): Promise<void>
}

/** Transport and timers belong to the adapter; retry decisions are shared. */
export async function reconnectSessions(
	options: SessionReconnectOptions,
): Promise<void> {
	let attempt = 0
	while (!options.isStopped()) {
		let connectedAt: number | undefined
		let failure: unknown = new Error(
			'Session updates disconnected. Reconnecting…',
		)
		try {
			await options.watch((session, timer) => {
				if (options.isStopped()) return
				connectedAt ??= Date.now()
				options.onSession(session, timer)
			})
		} catch (error) {
			failure = error
		}
		if (options.isStopped()) return
		options.onDisconnected(failure)
		if (options.isAuthenticationError(failure)) return
		if (connectedAt !== undefined && Date.now() - connectedAt >= 30_000)
			attempt = 0
		await options.wait(reconnectDelay(attempt++))
	}
}
