import { describe, expect, mock, test } from 'bun:test'
import type { CreateMediaPlayer, MediaPlayer } from '@/dal/media-player'
import type { PlayerSnapshot } from '@/shared/mpris'
import { PlayerController, type PlayerState } from './player-controller'

const playing: PlayerSnapshot = {
	status: 'playing',
	title: 'Song',
	artist: 'Artist',
	canPlayPause: true,
	canGoNext: true,
	canGoPrevious: true,
}

interface FakePlayer extends MediaPlayer {
	id: string
	emit(snapshot: PlayerSnapshot | null): void
	disposed: boolean
}

function setup() {
	const players: FakePlayer[] = []
	const create: CreateMediaPlayer = (id, onSnapshot) => {
		const player: FakePlayer = {
			id,
			disposed: false,
			emit: onSnapshot,
			playPause: mock(() => Promise.resolve()),
			next: mock(() => Promise.resolve()),
			previous: mock(() => Promise.resolve()),
			dispose() {
				player.disposed = true
			},
		}
		players.push(player)
		return player
	}
	const states: PlayerState[] = []
	const errors: unknown[] = []
	const controller = new PlayerController(
		create,
		(state) => states.push(state),
		(error) => errors.push(error),
	)
	return { controller, players, states, errors }
}

describe('PlayerController', () => {
	test('stays unconfigured until a player is selected', () => {
		const { controller, players, states } = setup()
		controller.select('')
		expect(controller.state).toEqual({ status: 'unconfigured' })
		expect(players).toHaveLength(0)
		expect(states).toHaveLength(0)
	})

	test('connects only to the selected player and follows its lifecycle', () => {
		const { controller, players, states } = setup()
		controller.select('rhythmbox')
		expect(players.map((player) => player.id)).toEqual(['rhythmbox'])
		expect(controller.state).toEqual({ status: 'not-running' })
		players[0].emit(playing)
		expect(controller.state).toEqual({ status: 'running', playback: playing })
		players[0].emit(null)
		expect(states.map((state) => state.status)).toEqual([
			'not-running',
			'running',
			'not-running',
		])
	})

	test('publishes only real changes', () => {
		const { controller, players, states } = setup()
		controller.select('rhythmbox')
		players[0].emit(playing)
		players[0].emit({ ...playing })
		expect(states).toHaveLength(2)
		players[0].emit({ ...playing, title: 'Next song' })
		expect(states).toHaveLength(3)
	})

	test('switching players disposes the old one and ignores its late events', () => {
		const { controller, players } = setup()
		controller.select('rhythmbox')
		controller.select('spotify')
		expect(players[0].disposed).toBe(true)
		players[0].emit(playing)
		expect(controller.state).toEqual({ status: 'not-running' })
		controller.select('')
		expect(players[1].disposed).toBe(true)
		expect(controller.state).toEqual({ status: 'unconfigured' })
	})

	test('handles a snapshot emitted synchronously during creation', () => {
		const states: PlayerState[] = []
		const controller = new PlayerController(
			(_id, onSnapshot) => {
				onSnapshot(playing)
				return {
					playPause: () => Promise.resolve(),
					next: () => Promise.resolve(),
					previous: () => Promise.resolve(),
					dispose() {},
				}
			},
			(state) => states.push(state),
			() => {},
		)
		controller.select('rhythmbox')
		expect(controller.state.status).toBe('running')
	})

	test('sends commands only when the player allows them', () => {
		const { controller, players } = setup()
		controller.select('rhythmbox')
		controller.playPause()
		expect(players[0].playPause).not.toHaveBeenCalled()
		players[0].emit({ ...playing, canGoNext: false })
		controller.playPause()
		controller.next()
		controller.previous()
		expect(players[0].playPause).toHaveBeenCalledTimes(1)
		expect(players[0].next).not.toHaveBeenCalled()
		expect(players[0].previous).toHaveBeenCalledTimes(1)
	})

	test('reports failed commands instead of throwing', async () => {
		const { controller, players, errors } = setup()
		controller.select('rhythmbox')
		players[0].emit(playing)
		const failure = new Error('player quit')
		players[0].next = () => Promise.reject(failure)
		controller.next()
		await Promise.resolve()
		expect(errors).toEqual([failure])
	})

	test('dispose releases the player', () => {
		const { controller, players } = setup()
		controller.select('rhythmbox')
		controller.dispose()
		expect(players[0].disposed).toBe(true)
		players[0].emit(playing)
		expect(controller.state.status).not.toBe('running')
	})
})
