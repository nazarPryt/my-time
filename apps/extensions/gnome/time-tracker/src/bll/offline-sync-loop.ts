import { reconnectDelay } from '@my-time/session-sync'

interface RetryWait {
	wait(milliseconds: number): Promise<void>
	dispose(): void
}

/** Retries queued writes only; idle server state is never polled. */
export class OfflineSyncLoop {
	private running = false
	private stopped = false
	constructor(
		private retry: RetryWait,
		private pending: () => boolean,
		private flush: () => Promise<void>,
	) {}
	wake(): void {
		if (!this.running && !this.stopped && this.pending()) void this.run()
	}
	private async run(): Promise<void> {
		this.running = true
		let attempt = 0
		try {
			while (!this.stopped && this.pending()) {
				await this.flush()
				if (this.stopped || !this.pending()) break
				await this.retry.wait(reconnectDelay(attempt++))
			}
		} catch {
			// Disposal cancels the wait. Unacknowledged work remains in storage.
		} finally {
			this.running = false
		}
	}
	dispose(): void {
		this.stopped = true
		this.retry.dispose()
	}
}
