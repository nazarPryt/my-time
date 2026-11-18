import Gio from 'gi://Gio'
import GLib from 'gi://GLib'
import {
	MPRIS_PATH,
	MPRIS_PREFIX,
	MPRIS_ROOT_INTERFACE,
	playerIdFromBusName,
} from '@/shared/mpris'
import { callBus, listBusNames, sessionBus, watchNameOwners } from './dbus'

export interface AvailablePlayer {
	id: string
	name: string
	icon: Gio.Icon | null
}

// A frozen player must not keep the settings list loading forever.
const IDENTITY_TIMEOUT_MS = 2000

function appIcon(desktopEntry: unknown): Gio.Icon | null {
	if (typeof desktopEntry !== 'string' || !desktopEntry) return null
	try {
		return Gio.DesktopAppInfo.new(`${desktopEntry}.desktop`)?.get_icon() ?? null
	} catch {
		return null
	}
}

/** Lists running MPRIS players; used only by the preferences window. */
export class PlayerDiscovery {
	private readonly bus = sessionBus()
	private readonly cancellable = new Gio.Cancellable()
	private readonly unwatch: () => void

	constructor(onChange: () => void) {
		this.unwatch = watchNameOwners(this.bus, MPRIS_PREFIX.slice(0, -1), () =>
			onChange(),
		)
	}

	async list(): Promise<AvailablePlayer[]> {
		const names = await listBusNames(this.bus, this.cancellable)
		const byId = new Map<string, string>()
		for (const name of names) {
			const id = playerIdFromBusName(name)
			if (id && !byId.has(id)) byId.set(id, name)
		}
		const players = await Promise.all(
			[...byId].map(([id, busName]) => this.describe(id, busName)),
		)
		return players.sort((a, b) => a.name.localeCompare(b.name))
	}

	dispose(): void {
		this.cancellable.cancel()
		this.unwatch()
	}

	private async describe(
		id: string,
		busName: string,
	): Promise<AvailablePlayer> {
		try {
			const reply = await callBus(
				this.bus,
				busName,
				MPRIS_PATH,
				'org.freedesktop.DBus.Properties',
				'GetAll',
				new GLib.Variant('(s)', [MPRIS_ROOT_INTERFACE]),
				this.cancellable,
				IDENTITY_TIMEOUT_MS,
			)
			const [properties] = reply.recursiveUnpack() as [Record<string, unknown>]
			const identity = properties.Identity
			return {
				id,
				name: typeof identity === 'string' && identity ? identity : id,
				icon: appIcon(properties.DesktopEntry),
			}
		} catch {
			return { id, name: id, icon: null }
		}
	}
}
