import Gio from 'gi://Gio'
import {
	busNameForPlayer,
	MPRIS_PATH,
	MPRIS_PLAYER_INTERFACE,
	matchesPlayer,
	type PlayerProperties,
	type PlayerSnapshot,
	pickBusName,
	snapshotFromProperties,
} from '@/shared/mpris'
import {
	callBus,
	isCancelled,
	listBusNames,
	sessionBus,
	watchNameOwners,
} from './dbus'
import type { CreateMediaPlayer, MediaPlayer } from './media-player'

const PROPERTY_NAMES: (keyof PlayerProperties)[] = [
	'PlaybackStatus',
	'Metadata',
	'CanControl',
	'CanPlay',
	'CanPause',
	'CanGoNext',
	'CanGoPrevious',
]

/**
 * Event-driven MPRIS adapter for one player id: no polling, no timers.
 * Holds at most one proxy, created only while the player is running.
 */
export class MprisPlayer implements MediaPlayer {
	private readonly bus = sessionBus()
	private readonly cancellable = new Gio.Cancellable()
	private readonly names = new Set<string>()
	private readonly unwatch: () => void
	private proxy: Gio.DBusProxy | null = null
	private proxySignal = 0
	private proxyName: string | null = null
	private disposed = false

	constructor(
		private readonly playerId: string,
		private readonly onSnapshot: (snapshot: PlayerSnapshot | null) => void,
		private readonly reportError: (error: unknown) => void,
	) {
		this.unwatch = watchNameOwners(
			this.bus,
			busNameForPlayer(playerId),
			(name, running) => {
				if (!matchesPlayer(name, playerId)) return
				if (running) this.names.add(name)
				else this.names.delete(name)
				this.syncProxy()
			},
		)
		listBusNames(this.bus, this.cancellable)
			.then((names) => {
				// The reply is ordered after earlier signals, so it is authoritative.
				this.names.clear()
				for (const name of names)
					if (matchesPlayer(name, playerId)) this.names.add(name)
				this.syncProxy()
			})
			.catch((error) => this.fail(error))
	}

	playPause(): Promise<void> {
		return this.call('PlayPause')
	}

	next(): Promise<void> {
		return this.call('Next')
	}

	previous(): Promise<void> {
		return this.call('Previous')
	}

	dispose(): void {
		if (this.disposed) return
		this.disposed = true
		this.cancellable.cancel()
		this.unwatch()
		this.dropProxy()
	}

	private async call(method: string): Promise<void> {
		if (!this.proxyName || this.disposed) return
		await callBus(
			this.bus,
			this.proxyName,
			MPRIS_PATH,
			MPRIS_PLAYER_INTERFACE,
			method,
			null,
			this.cancellable,
		).catch((error) => {
			if (!isCancelled(error)) throw error
		})
	}

	private syncProxy(): void {
		if (this.disposed) return
		const desired = pickBusName(this.names, this.playerId)
		if (desired === this.proxyName) return
		this.dropProxy()
		this.proxyName = desired
		if (!desired) {
			this.onSnapshot(null)
			return
		}
		Gio.DBusProxy.new(
			this.bus,
			Gio.DBusProxyFlags.DO_NOT_AUTO_START |
				Gio.DBusProxyFlags.GET_INVALIDATED_PROPERTIES,
			null,
			desired,
			MPRIS_PATH,
			MPRIS_PLAYER_INTERFACE,
			this.cancellable,
			(_source, result) => {
				try {
					const proxy = Gio.DBusProxy.new_finish(result)
					if (this.disposed || this.proxyName !== desired) return
					this.proxy = proxy
					this.proxySignal = proxy.connect('g-properties-changed', () =>
						this.emitSnapshot(),
					)
					this.emitSnapshot()
				} catch (error) {
					this.fail(error)
				}
			},
		)
	}

	private emitSnapshot(): void {
		const proxy = this.proxy
		if (!proxy || this.disposed) return
		const properties: PlayerProperties = {}
		for (const name of PROPERTY_NAMES)
			properties[name] = proxy.get_cached_property(name)?.recursiveUnpack()
		this.onSnapshot(snapshotFromProperties(properties))
	}

	private dropProxy(): void {
		if (this.proxy && this.proxySignal) this.proxy.disconnect(this.proxySignal)
		this.proxy = null
		this.proxySignal = 0
		this.proxyName = null
	}

	private fail(error: unknown): void {
		if (!this.disposed && !isCancelled(error)) this.reportError(error)
	}
}

export function createMprisPlayerFactory(
	reportError: (error: unknown) => void,
): CreateMediaPlayer {
	return (playerId, onSnapshot) =>
		new MprisPlayer(playerId, onSnapshot, reportError)
}
