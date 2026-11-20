/**
 * Framework-agnostic contract every micro frontend (remote) implements.
 *
 * The host never imports a remote's framework (Vue, Svelte, React…). It only
 * hands the remote a DOM element and plain props, and gets back a handle to
 * push new props and tear it down. This is what lets a React host embed a Vue
 * remote — and lets either side upgrade its framework independently.
 */

/** Props every remote receives, whatever it does. */
export interface RemoteBaseProps {
	/**
	 * Called when the remote hits an error it cannot recover from (e.g. an
	 * exception inside its own framework's render). Errors there never reach
	 * the host's React error boundary, so this is the remote's only way to
	 * tell the host to show its fallback UI.
	 */
	onError?: (error: Error) => void
}

/**
 * The host's authenticated fetch for its own API. `path` is relative to the
 * API prefix (e.g. `/english-quiz/topics`); the host adds the API origin, the
 * access token and refreshes an expired one. The remote never sees tokens.
 */
export type RemoteApiFetch = (
	path: string,
	init?: RequestInit,
) => Promise<Response>

export interface MountedRemote<Props> {
	/** Push new props without remounting (keeps the remote's internal state). */
	update(props: Props): void
	/** Remove everything the remote rendered and release its resources. */
	unmount(): void
}

export type RemoteMount<Props> = (
	container: HTMLElement,
	props: Props,
) => MountedRemote<Props>

/** Shape of the module a remote exposes through Module Federation. */
export interface RemoteModule<Props> {
	/**
	 * Major version of the props/events contract the remote was built against.
	 * Bump it on any breaking change; the host refuses to mount a remote whose
	 * version it does not support instead of crashing at runtime.
	 */
	contractVersion: number
	mount: RemoteMount<Props>
}

/** Everything the host needs to locate and load one remote at runtime. */
export interface RemoteDescriptor {
	/** Module Federation container name (must match the remote's `name`). */
	name: string
	/** Exposed module path, e.g. `./mount`. */
	expose: `./${string}`
	/** Contract major version the host was written against. */
	contractVersion: number
}
