import {
	reconnectSessions,
	SessionSyncState,
	TimerDisplay,
} from '@my-time/session-sync'
import type { SessionResponse, TimerSnapshot, TimerState } from 'contracts'
import { AuthenticationError } from '@/dal/api-client'
import { elapsedSeconds } from '@/shared/elapsed'
import { errorMessage } from '@/shared/errors'

export interface TrackerApi {
	getActive(): Promise<SessionResponse | null>
	getTimer?(): Promise<TimerState>
	start(): Promise<SessionResponse>
	end(id: string): Promise<void>
	watch(
		onSession: (session: SessionResponse | null, timer?: TimerSnapshot) => void,
	): Promise<void>
	dispose(): void
}

export interface SyncRetryDelay {
	wait(milliseconds: number): Promise<void>
	dispose(): void
}

export { reconnectDelay } from '@my-time/session-sync'

export interface TrackerState {
	activeSession: SessionResponse | null
	status: 'loading' | 'ready' | 'working' | 'offline' | 'signed-out'
	busy: boolean
	message: string
}

/** Serializes commands and reconciles pushes received during in-flight HTTP work. */
export class TrackerController {
	state: TrackerState = {
		activeSession: null,
		status: 'loading',
		busy: false,
		message: 'Connecting…',
	}
	private disposed = false
	private sync = new SessionSyncState()
	private pendingRefresh = false
	private retry: SyncRetryDelay | undefined
	private timer: TimerDisplay | null = null

	constructor(
		private api: TrackerApi,
		private onChange: (state: TrackerState) => void,
	) {}

	async refresh(): Promise<void> {
		if (this.state.busy) {
			this.pendingRefresh = true
			return
		}
		await this.run(() => this.api.getTimer?.() ?? this.api.getActive())
	}

	async connect(retry: SyncRetryDelay): Promise<void> {
		if (this.retry || this.disposed) {
			retry.dispose()
			return
		}
		this.retry = retry
		await reconnectSessions({
			watch: (onSession) => this.api.watch(onSession),
			onSession: (session, timer) => {
				this.sync.receiveSnapshot()
				this.confirm(session, timer)
			},
			onDisconnected: (error) => this.connectionFailed(error),
			isAuthenticationError: (error) => error instanceof AuthenticationError,
			isStopped: () => this.disposed,
			wait: (milliseconds) => retry.wait(milliseconds),
		})
	}

	async start(): Promise<void> {
		await this.run(async () => {
			const active = await this.currentSession()
			if (this.disposed) return null
			return active ?? this.api.start()
		})
	}

	async stop(): Promise<void> {
		await this.run(async () => {
			const active = await this.currentSession()
			if (this.disposed) return null
			if (active) await this.api.end(active.id)
			if (this.disposed) return null
			// The confirmed end response and live snapshots make a follow-up read
			// redundant. Reconcile explicitly when streaming is unavailable.
			return this.sync.connected ? null : this.api.getActive()
		})
	}

	private currentSession(): Promise<SessionResponse | null> {
		return this.sync.currentSession(
			() => this.state.activeSession,
			() => this.api.getActive(),
		)
	}

	dispose(): void {
		this.disposed = true
		this.sync.reset()
		this.retry?.dispose()
		this.api.dispose()
		this.timer = null
	}

	displayedSeconds(mode: 'session' | 'daily'): number | null {
		if (!this.timer)
			return mode === 'daily' ? null : elapsedSeconds(this.state.activeSession)
		return mode === 'daily'
			? this.timer.dailySeconds()
			: this.timer.sessionSeconds()
	}

	private update(next: Partial<TrackerState>): void {
		if (this.disposed) return
		this.state = { ...this.state, ...next }
		this.onChange(this.state)
	}

	private confirm(
		activeSession: SessionResponse | null,
		timer?: TimerSnapshot,
	): void {
		if (timer) this.timer = new TimerDisplay(timer)
		else if (activeSession?.id !== this.state.activeSession?.id)
			this.timer = null
		const offline = Boolean(this.retry && !this.sync.connected)
		let status: TrackerState['status'] = activeSession ? 'working' : 'ready'
		let message = activeSession ? 'Working' : 'Ready to work'
		if (offline) {
			status = 'offline'
			message = 'Updates disconnected. Reconnecting…'
		}
		this.update({ activeSession, status, message })
	}

	private connectionFailed(error: unknown): void {
		this.sync.disconnect()
		this.update({
			status: error instanceof AuthenticationError ? 'signed-out' : 'offline',
			message: errorMessage(error, 'Updates disconnected. Reconnecting…'),
		})
	}

	private async run(
		action: () => Promise<SessionResponse | TimerState | null>,
	): Promise<void> {
		if (this.disposed || this.state.busy) return
		const checkpoint = this.sync.checkpoint()
		this.update({ busy: true })
		try {
			const result = await action()
			if (this.sync.isCurrent(checkpoint))
				await this.confirmResult(result, checkpoint)
		} catch (error) {
			if (this.sync.isCurrent(checkpoint))
				this.update({
					status:
						error instanceof AuthenticationError ? 'signed-out' : 'offline',
					message: errorMessage(error, 'Unable to connect. Try again.'),
				})
		} finally {
			this.update({ busy: false })
		}
		if (
			this.pendingRefresh &&
			!this.disposed &&
			this.state.status !== 'signed-out'
		) {
			this.pendingRefresh = false
			await this.refresh()
		}
	}

	private async confirmResult(
		result: SessionResponse | TimerState | null,
		checkpoint: ReturnType<SessionSyncState['checkpoint']>,
	): Promise<void> {
		if (result && 'timer' in result) {
			this.confirm(result.activeSession, result.timer)
			return
		}
		this.confirm(result)
		if (!this.api.getTimer) return
		const snapshot = await this.api.getTimer()
		if (this.sync.isCurrent(checkpoint))
			this.confirm(snapshot.activeSession, snapshot.timer)
	}
}
