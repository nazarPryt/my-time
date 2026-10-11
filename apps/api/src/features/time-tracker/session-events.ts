import { logger } from '@shared/logger'
import {
	DESKTOP_PRESENCE_EVENT,
	SESSION_STREAM_EVENT,
	type SessionStreamState,
} from 'contracts'
import { differenceInMilliseconds } from 'date-fns'
import {
	desktopPresenceService,
	startDesktopPresenceListener,
	subscribeDesktopPresence,
} from './desktop-presence'
import { timeTrackerService } from './service'
import {
	startSessionListener,
	subscribeSessionChanges,
} from './session-listener'

const HEARTBEAT_MS = 20_000
const encoder = new TextEncoder()
type ClientKind = 'web' | 'desktop' | undefined

/** Pending flags bound memory; presence changes never reread work sessions. */
class SessionStream {
	private closed = false
	private dirty = true
	private presenceDirty: boolean
	private lastPresence: boolean | undefined
	private desktopId: string | undefined
	private tokenExpiry = 0
	private lastRenewal = new Date()
	private wake: (() => void) | undefined
	private heartbeat: ReturnType<typeof setTimeout> | undefined
	private expiry: ReturnType<typeof setTimeout> | undefined
	private presenceExpiry: ReturnType<typeof setTimeout> | undefined
	private controller: ReadableStreamDefaultController<Uint8Array> | undefined
	private unsubscribe: () => void
	private unsubscribePresence: () => void
	private releasing: Promise<void> | undefined

	constructor(
		private userId: string,
		private signal: AbortSignal,
		clientKind: ClientKind,
	) {
		this.presenceDirty = clientKind === 'web'
		this.desktopId = clientKind === 'desktop' ? crypto.randomUUID() : undefined
		this.unsubscribe = subscribeSessionChanges(userId, () => {
			this.dirty = true
			this.wake?.()
		})
		this.unsubscribePresence =
			clientKind === 'web'
				? subscribeDesktopPresence(userId, this.markPresenceDirty)
				: () => {}
	}

	async initialize(expiresAt: number): Promise<void> {
		this.tokenExpiry = expiresAt
		if (this.desktopId)
			await desktopPresenceService.register(
				this.desktopId,
				this.userId,
				expiresAt,
			)
	}

	create(expiresAt: number): ReadableStream<Uint8Array> {
		return new ReadableStream<Uint8Array>({
			start: (controller) => {
				this.controller = controller
				this.signal.addEventListener('abort', this.close, { once: true })
				this.expiry = setTimeout(
					this.close,
					Math.max(0, expiresAt - Date.now()),
				)
				if (this.signal.aborted) this.close()
			},
			pull: (controller) => this.pull(controller),
			cancel: () => this.cleanup(),
		})
	}

	private markPresenceDirty = (): void => {
		this.presenceDirty = true
		this.wake?.()
	}
	private close = (): void => {
		if (this.closed) return
		void this.cleanup()
		this.controller?.close()
	}

	cleanup(): Promise<void> {
		if (this.closed) return this.releasing ?? Promise.resolve()
		this.closed = true
		clearTimeout(this.expiry)
		clearTimeout(this.heartbeat)
		clearTimeout(this.presenceExpiry)
		this.signal.removeEventListener('abort', this.close)
		this.unsubscribe()
		this.unsubscribePresence()
		this.wake?.()
		this.wake = undefined
		this.releasing = this.desktopId
			? desktopPresenceService
					.release(this.desktopId, this.userId)
					.catch((error) => {
						logger.error(
							{ err: error, userId: this.userId },
							'Desktop presence cleanup failed',
						)
					})
			: Promise.resolve()
		return this.releasing
	}

	private async waitForChange(): Promise<void> {
		if (this.dirty || this.presenceDirty || this.closed) return
		await new Promise<void>((resolve) => {
			this.wake = resolve
			this.heartbeat = setTimeout(resolve, HEARTBEAT_MS)
		})
		clearTimeout(this.heartbeat)
		this.wake = undefined
	}

	private async pull(
		controller: ReadableStreamDefaultController<Uint8Array>,
	): Promise<void> {
		try {
			await this.waitForChange()
			if (this.closed) return
			if (
				this.desktopId &&
				differenceInMilliseconds(new Date(), this.lastRenewal) >= HEARTBEAT_MS
			) {
				await desktopPresenceService.renew(this.desktopId, this.tokenExpiry)
				this.lastRenewal = new Date()
				if (this.closed) return
			}
			let sent = false
			if (this.dirty) {
				// Changes received during the read remain pending.
				this.dirty = false
				const activeSession = await timeTrackerService.getActive(this.userId)
				if (this.closed) return
				const state: SessionStreamState = { version: 1, activeSession }
				controller.enqueue(
					encoder.encode(
						`event: ${SESSION_STREAM_EVENT}\ndata: ${JSON.stringify(state)}\n\n`,
					),
				)
				sent = true
			}
			if (this.presenceDirty) {
				this.presenceDirty = false
				const expiresAt = await desktopPresenceService.snapshot(this.userId)
				if (this.closed) return
				clearTimeout(this.presenceExpiry)
				if (expiresAt)
					this.presenceExpiry = setTimeout(
						this.markPresenceDirty,
						Math.max(1, differenceInMilliseconds(expiresAt, new Date()) + 1),
					)
				const connected = expiresAt !== null
				if (connected !== this.lastPresence) {
					this.lastPresence = connected
					controller.enqueue(
						encoder.encode(
							`event: ${DESKTOP_PRESENCE_EVENT}\ndata: ${JSON.stringify({ connected })}\n\n`,
						),
					)
					sent = true
				}
			}
			if (!sent) controller.enqueue(encoder.encode(': heartbeat\n\n'))
		} catch (error) {
			if (this.closed) return
			logger.error({ err: error, userId: this.userId }, 'Session stream failed')
			void this.cleanup()
			controller.error(error)
		}
	}
}

export async function createSessionStream(
	userId: string,
	signal: AbortSignal,
	expiresAt: number,
	clientKind?: ClientKind,
): Promise<Response> {
	await startSessionListener()
	if (clientKind === 'web') await startDesktopPresenceListener()
	const stream = new SessionStream(userId, signal, clientKind)
	try {
		await stream.initialize(expiresAt)
	} catch (error) {
		await stream.cleanup()
		throw error
	}
	return new Response(stream.create(expiresAt), {
		headers: {
			'Content-Type': 'text/event-stream; charset=utf-8',
			'Cache-Control': 'no-store, no-transform',
			'X-Accel-Buffering': 'no',
		},
	})
}
