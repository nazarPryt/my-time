import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import {
	API_PREFIX,
	AUTH_ROUTES,
	ExchangeExtensionTokenResponseSchema,
	MeResponseSchema,
} from 'contracts'
import { INTEGRATION_API_URL } from '../../../scripts/e2e-integration-config'
import type { Tokens } from '../src/dal/api-client'

interface Device {
	process: ReturnType<typeof Bun.spawn>
	url: string
	directory: string
	ownerId: string
	tokens: Tokens
	online: boolean
	now: string
}
const devices = new Map<string, Device>()

async function authenticate(credentials: unknown) {
	const auth = await fetch(
		`${INTEGRATION_API_URL}${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.loginExtension}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(credentials),
		},
	)
	if (!auth.ok) throw new Error(`Authentication failed: ${auth.status}`)
	const tokens = ExchangeExtensionTokenResponseSchema.parse(await auth.json())
	const me = await fetch(
		`${INTEGRATION_API_URL}${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.me}`,
		{ headers: { Authorization: `Bearer ${tokens.accessToken}` } },
	)
	const { id: ownerId } = MeResponseSchema.parse(await me.json())
	return { tokens, ownerId }
}

async function launch(input: Omit<Device, 'process' | 'url'>): Promise<Device> {
	const process = Bun.spawn(
		['bun', resolve(import.meta.dir, 'offline-worker.ts')],
		{ stdout: 'pipe', stderr: 'inherit' },
	)
	try {
		const reader = process.stdout.getReader()
		const first = await reader.read()
		reader.releaseLock()
		const port = Number(new TextDecoder().decode(first.value).trim())
		if (!port) throw new Error('Offline worker did not start')
		const url = `http://127.0.0.1:${port}`
		const initialized = await fetch(`${url}/initialize`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				directory: input.directory,
				ownerId: input.ownerId,
				tokens: input.tokens,
				online: input.online,
				now: input.now,
			}),
		})
		if (!initialized.ok) throw new Error(await initialized.text())
		return { ...input, process, url }
	} catch (error) {
		process.kill()
		await process.exited
		throw error
	}
}

/** Supervisor survives worker restarts; tokens stay in memory, never on disk. */
export async function offlineDeviceRoute(
	request: Request,
): Promise<Response | undefined> {
	const path = new URL(request.url).pathname
	if (path === '/offline/connect') {
		const input = await request.json()
		const { tokens, ownerId } = await authenticate(input.credentials)
		const directory = await mkdtemp(join(tmpdir(), 'my-time-offline-e2e-'))
		try {
			const device = await launch({
				directory,
				ownerId,
				tokens,
				online: input.online ?? false,
				now: input.now,
			})
			const id = crypto.randomUUID()
			devices.set(id, device)
			return Response.json({ id })
		} catch (error) {
			await rm(directory, { recursive: true, force: true })
			throw error
		}
	}
	if (!path.startsWith('/offline/')) return undefined
	const [, , id, action] = path.split('/')
	const device = devices.get(id ?? '')
	if (!device) return new Response('Unknown offline device', { status: 404 })
	if (action === 'dispose') {
		devices.delete(id ?? '')
		device.process.kill()
		await device.process.exited
		await rm(device.directory, { recursive: true, force: true })
		return Response.json({ disposed: true })
	}
	if (action === 'restart') {
		// Abrupt termination proves recovery does not depend on disable()/dispose().
		device.process.kill(9)
		await device.process.exited
		const replacement = await launch(device)
		devices.set(id ?? '', replacement)
		return fetch(`${replacement.url}/state`)
	}
	if (action === 'account') {
		const identity = await authenticate(await request.json())
		device.process.kill()
		await device.process.exited
		const replacement = await launch({ ...device, ...identity })
		devices.set(id ?? '', replacement)
		return fetch(`${replacement.url}/state`)
	}
	const body = request.method === 'GET' ? undefined : await request.text()
	if (action === 'network') device.online = JSON.parse(body ?? '{}').online
	if (action === 'clock') device.now = JSON.parse(body ?? '{}').now
	const response = await fetch(`${device.url}/${action}`, {
		method: request.method,
		headers: { 'Content-Type': 'application/json' },
		body,
	})
	// Fault injection can cut the connection after a committed upload.
	const state = await response.json()
	device.online = state.online
	return Response.json(state, { status: response.status })
}

export async function disposeOfflineDevices(): Promise<void> {
	for (const device of devices.values()) {
		device.process.kill()
		await device.process.exited
		await rm(device.directory, { recursive: true, force: true })
	}
	devices.clear()
}
