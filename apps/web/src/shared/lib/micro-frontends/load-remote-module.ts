import { createInstance } from '@module-federation/runtime'
import type { RemoteDescriptor, RemoteModule } from '@my-time/micro-frontends'

const DEFAULT_TIMEOUT_MS = 15_000

export class RemoteLoadError extends Error {
	override name = 'RemoteLoadError'
}

/**
 * The host's Module Federation runtime. We use the runtime API instead of the
 * build plugin on purpose: remotes are registered at runtime, so the host
 * build never needs to know a remote's URL or wait for it to exist. A remote
 * can be redeployed without rebuilding the host.
 */
let federation: ReturnType<typeof createInstance> | null = null
const registeredEntries = new Map<string, string>()

function getFederation() {
	federation ??= createInstance({ name: 'web', remotes: [] })
	return federation
}

function withTimeout<T>(promise: Promise<T>, ms: number, name: string) {
	return new Promise<T>((resolve, reject) => {
		const timer = setTimeout(
			() => reject(new RemoteLoadError(`${name} did not load within ${ms}ms`)),
			ms,
		)
		promise.then(
			(value) => {
				clearTimeout(timer)
				resolve(value)
			},
			(error: unknown) => {
				clearTimeout(timer)
				reject(error)
			},
		)
	})
}

/**
 * Loads a remote's exposed module and verifies it speaks the contract version
 * the host was built for.
 *
 * @param entry URL of the remote's `mf-manifest.json`. Served same-origin
 *   under `/remotes/<name>/` (Vite proxy in dev, nginx proxy in production).
 */
export async function loadRemoteModule<Props>(
	descriptor: RemoteDescriptor,
	entry: string,
	{ timeoutMs = DEFAULT_TIMEOUT_MS } = {},
): Promise<RemoteModule<Props>> {
	const mf = getFederation()
	if (registeredEntries.get(descriptor.name) !== entry) {
		// force: replace a previous registration (e.g. a retry after a failure)
		mf.registerRemotes([{ name: descriptor.name, entry }], { force: true })
		registeredEntries.set(descriptor.name, entry)
	}

	const id = `${descriptor.name}/${descriptor.expose.slice(2)}`
	let module: RemoteModule<Props> | null
	try {
		module = await withTimeout(
			mf.loadRemote<RemoteModule<Props>>(id),
			timeoutMs,
			descriptor.name,
		)
	} catch (error) {
		// Forget the registration so the next attempt starts from scratch
		// instead of reusing a cached failure.
		registeredEntries.delete(descriptor.name)
		if (error instanceof RemoteLoadError) throw error
		throw new RemoteLoadError(`Failed to load ${id}`, { cause: error })
	}

	if (!module || typeof module.mount !== 'function') {
		registeredEntries.delete(descriptor.name)
		throw new RemoteLoadError(`${id} does not export a mount function`)
	}
	if (module.contractVersion !== descriptor.contractVersion) {
		throw new RemoteLoadError(
			`${descriptor.name} implements contract v${module.contractVersion}, host expects v${descriptor.contractVersion}`,
		)
	}
	return module
}
