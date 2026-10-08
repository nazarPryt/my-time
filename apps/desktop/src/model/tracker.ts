import type { SessionResponse } from 'contracts'
import { AuthenticationError } from '../api/client.js'

export interface TrackerApi {
	getActive(): Promise<SessionResponse | null>
	start(): Promise<SessionResponse>
	end(id: string): Promise<void>
	dispose(): void
}

export interface TrackerState {
	activeSession: SessionResponse | null
	status: 'loading' | 'ready' | 'working' | 'offline' | 'signed-out'
	busy: boolean
	message: string
}

/** Serializes polling and button actions, and ignores results after teardown. */
export class TrackerController {
	state: TrackerState = {
		activeSession: null,
		status: 'loading',
		busy: false,
		message: 'Connecting…',
	}
	private disposed = false

	constructor(
		private api: TrackerApi,
		private onChange: (state: TrackerState) => void,
	) {}

	async refresh(): Promise<void> {
		await this.run(() => this.api.getActive())
	}

	async start(): Promise<void> {
		await this.run(async () => (await this.api.getActive()) ?? this.api.start())
	}

	async stop(): Promise<void> {
		await this.run(async () => {
			const active = await this.api.getActive()
			if (active) await this.api.end(active.id)
			return this.api.getActive()
		})
	}

	dispose(): void {
		this.disposed = true
		this.api.dispose()
	}

	private update(next: Partial<TrackerState>): void {
		if (this.disposed) return
		this.state = { ...this.state, ...next }
		this.onChange(this.state)
	}

	private async run(
		action: () => Promise<SessionResponse | null>,
	): Promise<void> {
		if (this.disposed || this.state.busy) return
		this.update({ busy: true })
		try {
			const activeSession = await action()
			this.update({
				activeSession,
				status: activeSession ? 'working' : 'ready',
				message: activeSession ? 'Working' : 'Ready to work',
			})
		} catch (error) {
			this.update({
				status: error instanceof AuthenticationError ? 'signed-out' : 'offline',
				message:
					error instanceof Error
						? error.message
						: 'Unable to connect. Try again.',
			})
		} finally {
			this.update({ busy: false })
		}
	}
}
