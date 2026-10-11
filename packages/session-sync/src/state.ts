export interface SyncCheckpoint {
	revision: number
	lifecycle: number
}

/** A snapshot supersedes HTTP results; a new lifetime supersedes all old work. */
export class SessionSyncState {
	connected = false
	private revision = 0
	private lifecycle = 0

	reset(): void {
		this.connected = false
		this.lifecycle++
		this.invalidate()
	}

	receiveSnapshot(): void {
		this.connected = true
		this.invalidate()
	}

	disconnect(): void {
		// Losing transport does not make a confirmed HTTP result stale.
		this.connected = false
	}

	invalidate(): void {
		this.revision++
	}

	checkpoint(): SyncCheckpoint {
		return { revision: this.revision, lifecycle: this.lifecycle }
	}

	isCurrent(checkpoint: SyncCheckpoint): boolean {
		return (
			this.isSameLifetime(checkpoint) && checkpoint.revision === this.revision
		)
	}

	isSameLifetime(checkpoint: SyncCheckpoint): boolean {
		return checkpoint.lifecycle === this.lifecycle
	}

	/** Reuse pushed state while connected; otherwise reconcile with the server. */
	async currentSession<T>(
		cached: () => T,
		fetch: () => Promise<T>,
	): Promise<T> {
		if (this.connected) return cached()
		const server = await fetch()
		// A reconnect snapshot may have arrived while the HTTP read was pending.
		return this.connected ? cached() : server
	}
}
