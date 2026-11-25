import { CLIENT_ERROR_SOURCES } from '@my-time/contracts'
import client from 'prom-client'
import { API_CONFIG } from './api-config'
import { APP_VERSION } from './app-version'
import { logger } from './logger'

// Metric names and labels are a contract with the Grafana dashboards and
// alert rules — see docs/observability.md before renaming anything.
export const metricsRegistry = new client.Registry()
client.collectDefaultMetrics({ register: metricsRegistry })

export const httpRequestsTotal = new client.Counter({
	name: 'http_requests_total',
	help: 'HTTP requests handled, by route pattern and status code.',
	labelNames: ['method', 'route', 'status'] as const,
	registers: [metricsRegistry],
})

export const httpRequestDuration = new client.Histogram({
	name: 'http_request_duration_seconds',
	help: 'HTTP response time, excluding SSE streams.',
	labelNames: ['method', 'route', 'status'] as const,
	buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
	registers: [metricsRegistry],
})

export type SseStreamKind = 'session' | 'telegram-link'

export const sseConnections = new client.Gauge({
	name: 'sse_connections',
	help: 'Currently open SSE streams.',
	labelNames: ['stream'] as const,
	registers: [metricsRegistry],
})

export const sseConnectionsOpened = new client.Counter({
	name: 'sse_connections_opened_total',
	help: 'SSE streams opened.',
	labelNames: ['stream'] as const,
	registers: [metricsRegistry],
})

export const jobRunsTotal = new client.Counter({
	name: 'job_runs_total',
	help: 'Background job runs, by result.',
	labelNames: ['job', 'result'] as const,
	registers: [metricsRegistry],
})

export const jobDuration = new client.Histogram({
	name: 'job_duration_seconds',
	help: 'Background job run time.',
	labelNames: ['job'] as const,
	buckets: [0.1, 0.5, 1, 5, 15, 30, 60, 120, 300, 600],
	registers: [metricsRegistry],
})

export const jobLastSuccess = new client.Gauge({
	name: 'job_last_success_timestamp_seconds',
	help: 'Unix time of the last successful run (process start until the first run).',
	labelNames: ['job'] as const,
	registers: [metricsRegistry],
})

export const permessoChecksTotal = new client.Counter({
	name: 'permesso_checks_total',
	help: 'Permit portal checks, by trigger and result.',
	labelNames: ['trigger', 'result'] as const,
	registers: [metricsRegistry],
})

export const telegramMessagesTotal = new client.Counter({
	name: 'telegram_messages_total',
	help: 'Telegram messages sent to users, by result.',
	labelNames: ['result'] as const,
	registers: [metricsRegistry],
})

export type AuthEvent =
	| 'register'
	| 'login'
	| 'login_failed'
	| 'refresh'
	| 'refresh_failed'
	| 'logout'

export const authEventsTotal = new client.Counter({
	name: 'auth_events_total',
	help: 'Authentication events.',
	labelNames: ['event'] as const,
	registers: [metricsRegistry],
})

export const clientErrorsTotal = new client.Counter({
	name: 'client_errors_total',
	help: 'Errors reported by browser clients.',
	labelNames: ['source'] as const,
	registers: [metricsRegistry],
})

// Alerts use increase(), which can't see the first event after a restart
// unless the series already exists at 0.
for (const trigger of ['scheduled', 'manual'])
	for (const result of ['success', 'failure'])
		permessoChecksTotal.inc({ trigger, result }, 0)
for (const result of ['sent', 'failed', 'blocked'])
	telegramMessagesTotal.inc({ result }, 0)
for (const source of CLIENT_ERROR_SOURCES) clientErrorsTotal.inc({ source }, 0)

const appInfo = new client.Gauge({
	name: 'app_info',
	help: 'Always 1; the version label is the running release.',
	labelNames: ['version'] as const,
	registers: [metricsRegistry],
})
appInfo.set({ version: APP_VERSION }, 1)

/** Tracks one open SSE stream; call the returned function exactly once on close. */
export function trackSseStream(stream: SseStreamKind): () => void {
	sseConnections.inc({ stream })
	sseConnectionsOpened.inc({ stream })
	let open = true
	return () => {
		if (!open) return
		open = false
		sseConnections.dec({ stream })
	}
}

/**
 * Serves /metrics on its own port so it never goes through the public API
 * proxy — only containers on the compose network can scrape it.
 */
export function startMetricsServer() {
	if (API_CONFIG.METRICS_PORT === 0) return null
	const server = Bun.serve({
		hostname: API_CONFIG.API_HOST,
		port: API_CONFIG.METRICS_PORT,
		fetch: async (request) => {
			if (new URL(request.url).pathname !== '/metrics')
				return new Response('Not Found', { status: 404 })
			return new Response(await metricsRegistry.metrics(), {
				headers: { 'Content-Type': metricsRegistry.contentType },
			})
		},
	})
	logger.info({ port: server.port }, 'metrics server listening')
	return server
}
