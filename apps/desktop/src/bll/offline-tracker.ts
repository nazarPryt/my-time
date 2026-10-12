import type {
	OfflineSession,
	SessionResponse,
	TimerSnapshot,
	TimerState,
} from 'contracts'
import { isEqual, max } from 'date-fns'
import type { OfflineJournal, OfflineStore } from '@/dal/offline-store'

export interface OfflineSyncApi {
	syncOffline(ownerId: string, sessions: OfflineSession[]): Promise<TimerState>
}

/** Durable observations only. Accounting and overlap decisions belong to the API. */
export class OfflineTracker {
	private journal: OfflineJournal
	constructor(
		private storage: OfflineStore,
		private ownerId: string,
		private newId: () => string,
		private now: () => Date = () => new Date(),
	) {
		this.journal = storage.load()
	}
	get pending(): boolean {
		return this.journal.sessions.length > 0
	}
	get running(): OfflineSession | undefined {
		return this.journal.sessions.find((session) => !session.endedAt)
	}
	get confirmed(): SessionResponse | null {
		return this.journal.confirmed
	}
	get timer(): TimerSnapshot | undefined {
		return this.journal.timer
	}
	get active(): SessionResponse | null {
		const running = this.running
		return running
			? {
					id: running.id,
					type: 'work',
					startedAt:
						running.originSessionId === this.confirmed?.id
							? this.confirmed.startedAt
							: running.startedAt,
					endedAt: null,
					abandonedAt: null,
				}
			: null
	}
	private commit(journal: OfflineJournal): void {
		this.storage.save(journal)
		this.journal = journal
	}
	remember(confirmed: SessionResponse | null, timer?: TimerSnapshot): void {
		this.commit({ ...this.journal, confirmed, timer })
	}
	start(origin = this.confirmed, startedAt = this.now()): void {
		if (this.running) return
		this.commit({
			...this.journal,
			sessions: [
				...this.journal.sessions,
				{
					id: this.newId(),
					startedAt,
					endedAt: null,
					originSessionId: origin?.id ?? null,
				},
			],
		})
	}
	timestamp(): Date {
		return this.now()
	}
	stop(observedAt = this.now()): void {
		const running = this.running
		if (!running) return
		const endedAt = max([observedAt, running.startedAt])
		this.commit({
			...this.journal,
			sessions: this.journal.sessions.map((session) =>
				session.id === running.id ? { ...session, endedAt } : session,
			),
		})
	}
	async flush(
		api: OfflineSyncApi,
		isStopped: () => boolean,
	): Promise<TimerState | undefined> {
		let result: TimerState | undefined
		while (this.pending && !isStopped()) {
			// Upload completed observations before the single ongoing interval.
			const batch = [...this.journal.sessions]
				.sort((a, b) => Number(!a.endedAt) - Number(!b.endedAt))
				.slice(0, 100)
			result = await api.syncOffline(this.ownerId, batch)
			if (isStopped()) return undefined
			const acknowledged = new Map(
				batch.map((session) => [session.id, session]),
			)
			this.commit({
				...this.journal,
				sessions: this.journal.sessions.filter((session) => {
					const sent = acknowledged.get(session.id)
					return (
						!sent ||
						(sent.endedAt && session.endedAt
							? !isEqual(sent.endedAt, session.endedAt)
							: sent.endedAt !== session.endedAt)
					)
				}),
				confirmed: result.activeSession,
				timer: result.timer,
			})
		}
		return result
	}
}
