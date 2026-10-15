import { EventEmitter } from 'node:events'
import { client } from '@db'
import { logger } from '@shared/logger'

const CHANNEL = 'telegram_linked'

// One process-wide emitter keyed by userId, fed by this process's own
// Postgres LISTEN connection (see startTelegramLinkListener). Publishing via
// NOTIFY instead of emitting directly means linking works even when the
// Telegram bot's /start handler and the SSE route waiting on it land on
// different API instances — Postgres fans NOTIFY out to every replica
// listening on the channel, and each replica re-emits locally to wake up
// only its own in-flight SSE requests.
const emitter = new EventEmitter()
emitter.setMaxListeners(0)

let listening: Promise<unknown> | undefined

/**
 * Opens this process's LISTEN connection. Must be awaited once at API
 * startup, before accepting requests — a NOTIFY fired before this resolves
 * would otherwise be missed.
 */
export function startTelegramLinkListener(): Promise<unknown> {
	listening ??= client.listen(CHANNEL, (userId) => {
		emitter.emit(userId)
	})
	return listening
}

export function notifyTelegramLinked(userId: string): void {
	client.notify(CHANNEL, userId).catch((error) => {
		logger.error(
			{ err: error, userId },
			'failed to publish telegram-linked notification',
		)
	})
}

/**
 * Resolves 'linked' as soon as notifyTelegramLinked(userId) fires, or
 * 'heartbeat' after heartbeatMs — whichever comes first. Always cleans up
 * its own listener/timer, so callers can loop this without leaking either.
 */
export function waitForTelegramLinkOrHeartbeat(
	userId: string,
	heartbeatMs: number,
): Promise<'linked' | 'heartbeat'> {
	return new Promise((resolve) => {
		const onLinked = () => {
			clearTimeout(timer)
			resolve('linked')
		}
		const timer = setTimeout(() => {
			emitter.off(userId, onLinked)
			resolve('heartbeat')
		}, heartbeatMs)
		emitter.once(userId, onLinked)
	})
}
