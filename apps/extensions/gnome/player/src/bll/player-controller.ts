import type { CreateMediaPlayer, MediaPlayer } from '@/dal/media-player'
import { type PlayerSnapshot, sameSnapshot } from '@/shared/mpris'

export type PlayerState =
	| { status: 'unconfigured' }
	| { status: 'not-running' }
	| { status: 'running'; playback: PlayerSnapshot }

function sameState(a: PlayerState, b: PlayerState): boolean {
	if (a.status === 'running' && b.status === 'running')
		return sameSnapshot(a.playback, b.playback)
	return a.status === b.status
}

/** Follows exactly one selected player and publishes only real changes. */
export class PlayerController {
	private current: PlayerState = { status: 'unconfigured' }
	private player: MediaPlayer | null = null
	private playerId = ''
	private generation = 0

	constructor(
		private readonly createPlayer: CreateMediaPlayer,
		private readonly onChange: (state: PlayerState) => void,
		private readonly reportError: (error: unknown) => void,
	) {}

	get state(): PlayerState {
		return this.current
	}

	select(playerId: string): void {
		if (playerId === this.playerId) return
		this.disconnect()
		this.playerId = playerId
		if (!playerId) {
			this.publish({ status: 'unconfigured' })
			return
		}
		this.publish({ status: 'not-running' })
		const generation = this.generation
		this.player = this.createPlayer(playerId, (snapshot) => {
			if (generation !== this.generation) return
			this.publish(
				snapshot
					? { status: 'running', playback: snapshot }
					: { status: 'not-running' },
			)
		})
	}

	playPause(): void {
		if (this.current.status === 'running' && this.current.playback.canPlayPause)
			this.send(this.player?.playPause())
	}

	next(): void {
		if (this.current.status === 'running' && this.current.playback.canGoNext)
			this.send(this.player?.next())
	}

	previous(): void {
		if (
			this.current.status === 'running' &&
			this.current.playback.canGoPrevious
		)
			this.send(this.player?.previous())
	}

	dispose(): void {
		this.disconnect()
		this.playerId = ''
	}

	private disconnect(): void {
		this.generation++
		this.player?.dispose()
		this.player = null
	}

	private send(command: Promise<void> | undefined): void {
		command?.catch(this.reportError)
	}

	private publish(state: PlayerState): void {
		if (sameState(this.current, state)) return
		this.current = state
		this.onChange(state)
	}
}
