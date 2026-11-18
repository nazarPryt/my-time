import type { PlayerSnapshot } from '@/shared/mpris'

/** One connection to the chosen player; adapters implement it per runtime. */
export interface MediaPlayer {
	playPause(): Promise<void>
	next(): Promise<void>
	previous(): Promise<void>
	dispose(): void
}

/** `null` snapshot means the player is not running. */
export type CreateMediaPlayer = (
	playerId: string,
	onSnapshot: (snapshot: PlayerSnapshot | null) => void,
) => MediaPlayer
