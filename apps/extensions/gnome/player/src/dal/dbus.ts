import Gio from 'gi://Gio'
import GLib from 'gi://GLib'

const BUS_NAME = 'org.freedesktop.DBus'
const BUS_PATH = '/org/freedesktop/DBus'

export function sessionBus(): Gio.DBusConnection {
	return Gio.DBus.session
}

export function isCancelled(error: unknown): boolean {
	return (
		error instanceof GLib.Error &&
		error.matches(Gio.IOErrorEnum, Gio.IOErrorEnum.CANCELLED)
	)
}

/** Async call that never auto-starts (activates) a closed player. */
export function callBus(
	bus: Gio.DBusConnection,
	destination: string,
	objectPath: string,
	interfaceName: string,
	method: string,
	parameters: GLib.Variant | null,
	cancellable: Gio.Cancellable,
	timeoutMs = -1,
): Promise<GLib.Variant> {
	return new Promise((resolve, reject) => {
		bus.call(
			destination,
			objectPath,
			interfaceName,
			method,
			parameters,
			null,
			Gio.DBusCallFlags.NO_AUTO_START,
			timeoutMs,
			cancellable,
			(_connection, result) => {
				try {
					resolve(bus.call_finish(result))
				} catch (error) {
					reject(error)
				}
			},
		)
	})
}

export async function listBusNames(
	bus: Gio.DBusConnection,
	cancellable: Gio.Cancellable,
): Promise<string[]> {
	const reply = await callBus(
		bus,
		BUS_NAME,
		BUS_PATH,
		BUS_NAME,
		'ListNames',
		null,
		cancellable,
	)
	const [names] = reply.deepUnpack() as [string[]]
	return names
}

/**
 * One filtered match rule: the bus only wakes us for names in `namespace`
 * (the name itself and any `namespace.*` child, e.g. instance suffixes).
 */
export function watchNameOwners(
	bus: Gio.DBusConnection,
	namespace: string,
	onChange: (name: string, running: boolean) => void,
): () => void {
	const id = bus.signal_subscribe(
		BUS_NAME,
		BUS_NAME,
		'NameOwnerChanged',
		BUS_PATH,
		namespace,
		Gio.DBusSignalFlags.MATCH_ARG0_NAMESPACE,
		(_connection, _sender, _path, _interface, _signal, parameters) => {
			const [name, , newOwner] = parameters.deepUnpack() as [
				string,
				string,
				string,
			]
			onChange(name, newOwner !== '')
		},
	)
	return () => bus.signal_unsubscribe(id)
}
