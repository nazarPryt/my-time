import { API_PREFIX } from 'contracts'
import { parseISO } from 'date-fns'
import { INTEGRATION_API_URL } from '../../../scripts/e2e-integration-config'
import { OfflineTracker } from '../src/bll/offline-tracker'
import { TrackerController } from '../src/bll/tracker-controller'
import type { Tokens } from '../src/dal/api-client'
import { ApiClient } from '../src/dal/api-client'
import { OfflineTestTransport } from './offline-transport'
import { persistentSettings } from './persistent-settings'

let controller: TrackerController | undefined
let offline: OfflineTracker | undefined
let now = new Date()
const transport = new OfflineTestTransport()
let tokens: Tokens | null = null
let savedQueue = () => 0

function retry() {
	const abort = new AbortController()
	return {
		wait: async () => {
			await Bun.sleep(100)
			if (abort.signal.aborted) throw new Error('Stopped')
		},
		dispose: () => abort.abort(),
	}
}

const server = Bun.serve({
	hostname: '127.0.0.1',
	port: 0,
	async fetch(request) {
		const action = new URL(request.url).pathname
		if (action === '/initialize') {
			const input = (await request.json()) as {
				directory: string
				ownerId: string
				tokens: Tokens
				online: boolean
				now: string
			}
			tokens = input.tokens
			now = parseISO(input.now)
			transport.online = input.online
			const store = persistentSettings(input.directory).createOfflineStore(
				`${INTEGRATION_API_URL}${API_PREFIX}`,
				input.ownerId,
			)
			savedQueue = () => store.load().sessions.length
			offline = new OfflineTracker(
				store,
				input.ownerId,
				() => crypto.randomUUID(),
				() => now,
			)
			const api = new ApiClient(
				transport,
				{
					load: async () => tokens,
					save: async (next) => {
						tokens = next
					},
					clear: async () => {
						tokens = null
					},
					dispose() {},
				},
				transport,
			)
			controller = new TrackerController(api, () => {}, offline, retry())
			void controller.connect(retry())
		}
		if (!controller || !offline)
			return new Response('Worker not initialized', { status: 409 })
		if (action === '/start') await controller.start()
		if (action === '/stop') await controller.stop()
		if (action === '/network')
			transport.setOnline((await request.json()).online)
		if (action === '/clock') now = parseISO((await request.json()).now)
		if (action === '/lose-response') transport.loseNextSyncResponse = true
		return Response.json({
			...controller.state,
			pid: process.pid,
			online: transport.online,
			pending: savedQueue(),
			journalRunning: offline.running,
			committedUploads: transport.committedUploads,
			dailySeconds: controller.displayedSeconds('daily'),
		})
	},
})
process.stdout.write(`${server.port}\n`)
process.on('SIGTERM', () => {
	controller?.dispose()
	server.stop(true)
	process.exit(0)
})
