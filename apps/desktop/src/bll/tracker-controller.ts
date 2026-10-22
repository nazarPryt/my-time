import {
	reconnectSessions,
	SessionSyncState,
	TimerDisplay,
} from '@my-time/session-sync'
import type { SessionResponse, TimerSnapshot, TimerState } from 'contracts'
import { AuthenticationError, ConnectionError } from '@/dal/api-client'
import { elapsedSeconds } from '@/shared/elapsed'
import { errorMessage } from '@/shared/errors'
import { OfflineSyncLoop } from './offline-sync-loop'
import type { OfflineSyncApi, OfflineTracker } from './offline-tracker'

export interface TrackerApi {
	syncOffline?: OfflineSyncApi['syncOffline']
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
	syncingOffline?: boolean
	pendingSessions: number
	lastSuccessfulSyncAt: Date | null
	message: string
}

/** Serializes commands and reconciles pushes received during in-flight HTTP work. */
export class TrackerController {
	state: TrackerState = {
		activeSession: null,
		status: 'loading',
		busy: false,
		pendingSessions: 0,
		lastSuccessfulSyncAt: null,
		message: 'Connecting…',
	}
	private disposed = false
	private sync = new SessionSyncState()
	private pendingRefresh = false
	private retry: SyncRetryDelay | undefined
	private timer: TimerDisplay | null = null
	private offlineSync: OfflineSyncLoop | undefined
	private syncingOffline = false

	constructor(
		private api: TrackerApi,
		private onChange: (state: TrackerState) => void,
		private offline?: OfflineTracker,
		offlineRetry?: SyncRetryDelay,
	) {
		this.state = {
			...this.state,
			pendingSessions: offline?.pendingSessions ?? 0,
			lastSuccessfulSyncAt: offline?.lastSuccessfulSyncAt ?? null,
		}
		if (offlineRetry && offline)
			this.offlineSync = new OfflineSyncLoop(
				offlineRetry,
				() => offline.pending && this.state.status !== 'signed-out',
				() => this.refresh(),
			)
		if (offline?.confirmed || offline?.pending) {
			this.state = {
				...this.state,
				activeSession: offline.pending ? offline.active : offline.confirmed,
				status: offline.pending ? 'offline' : 'loading',
				message: 'Restoring saved work. Connecting…',
			}
		}
	}

	async refresh(): Promise<void> {
		if (this.state.busy) {
			this.pendingRefresh = true
			return
		}
		await this.run(async () => {
			if (this.offline?.pending && this.api.syncOffline) {
				this.syncingOffline = true
				this.update({ syncingOffline: true })
				try {
					const result = await this.offline.flush(
						{ syncOffline: this.api.syncOffline.bind(this.api) },
						() => this.disposed,
						() => this.update({}),
					)
					if (this.disposed) return null
					return result ?? this.api.getTimer?.() ?? this.api.getActive()
				} finally {
					this.syncingOffline = false
					this.update({ syncingOffline: false })
				}
			}
			return this.api.getTimer?.() ?? this.api.getActive()
		})
	}

	async connect(retry: SyncRetryDelay): Promise<void> {
		if (this.retry || this.disposed) {
			retry.dispose()
			return
		}
		this.retry = retry
		this.offlineSync?.wake()
		await reconnectSessions({
			watch: (onSession) => this.api.watch(onSession),
			onSession: (session, timer) => {
				this.sync.receiveSnapshot()
				this.confirm(session, timer)
				if (this.offline?.pending) {
					void this.refresh()
					this.offlineSync?.wake()
				}
			},
			onDisconnected: (error) => this.connectionFailed(error),
			isAuthenticationError: (error) => error instanceof AuthenticationError,
			isStopped: () => this.disposed,
			wait: (milliseconds) => retry.wait(milliseconds),
		})
	}

	async start(): Promise<void> {
		if (
			this.offline &&
			(this.state.status === 'offline' || this.offline.pending)
		) {
			this.localCommand('start')
			return
		}
		await this.run(
			async () => {
				const active = await this.currentSession()
				if (this.disposed) return null
				return active ?? this.api.start()
			},
			'start',
			this.offline?.timestamp(),
		)
	}

	async stop(): Promise<void> {
		if (
			this.offline &&
			(this.state.status === 'offline' || this.offline.pending)
		) {
			this.localCommand('stop')
			return
		}
		await this.run(
			async () => {
				const active = await this.currentSession()
				if (this.disposed) return null
				if (active) await this.api.end(active.id)
				if (this.disposed) return null
				// The confirmed end response and live snapshots make a follow-up read
				// redundant. Reconcile explicitly when streaming is unavailable.
				return this.sync.connected ? null : this.api.getActive()
			},
			'stop',
			this.offline?.timestamp(),
		)
	}
	private localCommand(
		command: 'start' | 'stop',
		observedAt = this.offline?.timestamp(),
	): void {
		if (
			this.disposed ||
			(this.state.busy && !this.syncingOffline) ||
			!this.offline ||
			this.state.status === 'signed-out'
		)
			return
		try {
			if (command === 'start')
				this.offline.start(this.state.activeSession, observedAt)
			else {
				if (!this.offline.running && this.state.activeSession)
					this.offline.start(this.state.activeSession, observedAt)
				this.offline.stop(observedAt)
			}
			this.showOffline()
			void Promise.resolve().then(() => this.offlineSync?.wake())
		} catch (error) {
			this.update({
				message: errorMessage(error, 'Unable to save offline work.'),
			})
		}
	}
	private showOffline(): void {
		this.update({
			activeSession: this.offline
				? this.offline.active
				: this.state.activeSession,
			status: 'offline',
			message: this.offline?.running
				? 'Working offline. Saved on this desktop.'
				: this.offline?.pending
					? 'Waiting to sync. Saved on this desktop.'
					: 'Offline. You can start work on this desktop.',
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
		this.offlineSync?.dispose()
		this.api.dispose()
		this.timer = null
	}

	displayedSeconds(mode: 'session' | 'daily'): number | null {
		if (
			this.offline?.pending ||
			(this.offline && this.state.status === 'offline')
		)
			return mode === 'daily' ? null : elapsedSeconds(this.state.activeSession)
		if (!this.timer)
			return mode === 'daily' ? null : elapsedSeconds(this.state.activeSession)
		return mode === 'daily'
			? this.timer.dailySeconds()
			: this.timer.sessionSeconds()
	}

	private update(next: Partial<TrackerState>): void {
		if (this.disposed) return
		this.state = {
			...this.state,
			...next,
			pendingSessions: this.offline?.pendingSessions ?? 0,
			lastSuccessfulSyncAt: this.offline?.lastSuccessfulSyncAt ?? null,
		}
		this.onChange(this.state)
	}

	private confirm(
		activeSession: SessionResponse | null,
		timer?: TimerSnapshot,
	): void {
		if (this.offline?.pending) {
			this.showOffline()
			return
		}
		this.offline?.remember(activeSession, timer)
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
		if (this.offline && !(error instanceof AuthenticationError)) {
			try {
				if (!this.offline.pending && this.state.activeSession)
					this.offline.start(this.state.activeSession)
				this.showOffline()
				this.offlineSync?.wake()
			} catch (storageError) {
				this.update({
					status: 'offline',
					message: errorMessage(storageError, 'Unable to save offline work.'),
				})
			}
			return
		}
		this.update({
			status: error instanceof AuthenticationError ? 'signed-out' : 'offline',
			message: errorMessage(error, 'Updates disconnected. Reconnecting…'),
		})
	}

	private async run(
		action: () => Promise<SessionResponse | TimerState | null>,
		offlineCommand?: 'start' | 'stop',
		observedAt?: Date,
	): Promise<void> {
		if (this.disposed || this.state.busy) return
		const checkpoint = this.sync.checkpoint()
		this.update({ busy: true })
		try {
			const result = await action()
			if (this.sync.isCurrent(checkpoint))
				await this.confirmResult(result, checkpoint)
		} catch (error) {
			if (
				this.offline &&
				offlineCommand &&
				error instanceof ConnectionError &&
				!this.disposed &&
				this.sync.isCurrent(checkpoint)
			) {
				this.update({ busy: false, status: 'offline' })
				this.localCommand(offlineCommand, observedAt)
			} else if (this.sync.isCurrent(checkpoint))
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
