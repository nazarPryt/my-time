import { API_PREFIX } from 'contracts'
import {
	INTEGRATION_API_URL as API_URL,
	INTEGRATION_DESKTOP_PORT,
} from '../../../scripts/e2e-integration-config'
import { TrackerController } from '../src/bll/tracker-controller'
import { ApiClient, type Tokens } from '../src/dal/api-client'
import { disposeOfflineDevices, offlineDeviceRoute } from './offline-devices'

const controllers = new Map<
	string,
	{ controller: TrackerController; disconnect: () => void; resume: () => void }
>()

Bun.serve({
	port: INTEGRATION_DESKTOP_PORT,
	hostname: '127.0.0.1',
	async fetch(request) {
		const offlineResponse = await offlineDeviceRoute(request)
		if (offlineResponse) return offlineResponse
		const path = new URL(request.url).pathname
		if (path === '/health') return Response.json({ status: 'ok' })
		if (path === '/connect') {
			const credentials = await request.json()
			let tokens: Tokens | null = null
			const abort = new AbortController()
			let streamAbort = new AbortController()
			let retryGate: Promise<void> | undefined
			let resume = () => {}
			const client = new ApiClient(
				{
					async send(method, route, body, accessToken) {
						const response = await fetch(`${API_URL}${API_PREFIX}${route}`, {
							method,
							signal: abort.signal,
							headers: {
								'Content-Type': 'application/json',
								...(accessToken
									? { Authorization: `Bearer ${accessToken}` }
									: {}),
							},
							body: body === undefined ? undefined : JSON.stringify(body),
						})
						return { status: response.status, body: await response.json() }
					},
					dispose: () => abort.abort(),
				},
				{
					load: async () => tokens,
					save: async (value) => {
						tokens = value
					},
					clear: async () => {
						tokens = null
					},
					dispose() {},
				},
				{
					async open(route, accessToken) {
						streamAbort = new AbortController()
						const response = await fetch(`${API_URL}${API_PREFIX}${route}`, {
							headers: {
								Authorization: `Bearer ${accessToken}`,
								'User-Agent': 'my-time-desktop/integration',
							},
							signal: streamAbort.signal,
						})
						const reader = response.body?.getReader()
						return {
							status: response.status,
							contentType: response.headers.get('content-type') ?? '',
							read: async () => {
								const result = await reader?.read()
								return result?.done ? null : (result?.value ?? null)
							},
							close: () => {
								void reader?.cancel().catch(() => {})
							},
						}
					},
					dispose: () => streamAbort.abort(),
				},
			)
			await client.login(credentials)
			const controller = new TrackerController(client, () => {})
			const id = crypto.randomUUID()
			controllers.set(id, {
				controller,
				disconnect: () => {
					retryGate = new Promise<void>((resolve) => {
						resume = resolve
					})
					streamAbort.abort()
				},
				resume: () => {
					resume()
					retryGate = undefined
				},
			})
			void controller.connect({
				wait: async () => {
					if (retryGate) await retryGate
					else await Bun.sleep(100)
				},
				dispose: () => resume(),
			})
			return Response.json({ id })
		}
		const [id, action] = path.slice(1).split('/')
		const desktop = controllers.get(id ?? '')
		if (!desktop) return new Response('Unknown desktop', { status: 404 })
		if (action === 'start') await desktop.controller.start()
		if (action === 'stop') await desktop.controller.stop()
		if (action === 'disconnect') desktop.disconnect()
		if (action === 'resume') desktop.resume()
		if (action === 'dispose') {
			desktop.controller.dispose()
			controllers.delete(id ?? '')
		}
		return Response.json({
			...desktop.controller.state,
			dailySeconds: desktop.controller.displayedSeconds('daily'),
		})
	},
})

process.on('SIGTERM', async () => {
	await disposeOfflineDevices()
	process.exit(0)
})
