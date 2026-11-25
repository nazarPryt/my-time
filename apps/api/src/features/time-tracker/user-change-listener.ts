import { client } from '@db'
import { logger } from '@shared/logger'

type Listener = Awaited<ReturnType<typeof client.listen>>

/** A user-scoped notification channel with reconciliation after reconnects. */
export function createUserChangeListener(channel: string) {
	const subscribers = new Map<string, Set<() => void>>()
	let listening: Promise<Listener> | undefined
	let connections = 0
	function notifyUser(userId: string): void {
		for (const notify of subscribers.get(userId) ?? []) notify()
	}
	return {
		start(): Promise<Listener> {
			listening ??= client
				.listen(channel, notifyUser, () => {
					for (const userId of subscribers.keys()) notifyUser(userId)
					const reconnect = connections++ > 0
					// A reconnect means the DB connection dropped; changes may have been missed.
					logger[reconnect ? 'warn' : 'info'](
						{ channel, reconnect },
						'User notification listener connected',
					)
				})
				.catch((error) => {
					listening = undefined
					throw error
				})
			return listening
		},
		subscribe(userId: string, notify: () => void): () => void {
			const group = subscribers.get(userId) ?? new Set<() => void>()
			group.add(notify)
			subscribers.set(userId, group)
			return () => {
				group.delete(notify)
				if (!group.size) subscribers.delete(userId)
			}
		},
	}
}
