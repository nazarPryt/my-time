import { API_PREFIX } from '@my-time/contracts'
import { Elysia } from 'elysia'
import { logger } from './logger'
import { httpRequestDuration, httpRequestsTotal } from './metrics'

// One access line + metrics per request, and an error line only for real
// failures (5xx). Field names are a contract with Grafana: docs/observability.md.
const HEALTH_PATH = `${API_PREFIX}/health`
const UNMATCHED_ROUTE = 'unmatched'
export const REQUEST_ID_HEADER = 'X-Request-Id'

type RequestMeta = { id: string; start: number; errorCode?: string }

// Keyed by Request so 404s (which skip derive/resolve) are covered too.
const requests = new WeakMap<Request, RequestMeta>()

function metaFor(request: Request): RequestMeta {
	let meta = requests.get(request)
	if (!meta) {
		meta = { id: crypto.randomUUID(), start: performance.now() }
		requests.set(request, meta)
	}
	return meta
}

function statusCode(status: number | string | undefined): number {
	return typeof status === 'number' ? status : 200
}

/** SSE routes stay open for minutes, so their duration isn't a response time. */
export function isStreamRoute(route: string): boolean {
	return route.endsWith('/events')
}

export const httpLoggerPlugin = new Elysia({ name: 'http-logger' })
	.onRequest(({ request, set }) => {
		set.headers[REQUEST_ID_HEADER] = metaFor(request).id
	})
	.derive({ as: 'global' }, ({ request }) => ({
		requestId: metaFor(request).id,
	}))
	.onAfterResponse({ as: 'global' }, (context) => {
		const { request, path, set } = context
		if (path === HEALTH_PATH) return
		const meta = metaFor(request)
		const route = context.route || UNMATCHED_ROUTE
		const status = statusCode(set.status)
		const durationMs = performance.now() - meta.start
		const stream = isStreamRoute(route)
		const userId =
			'userId' in context && typeof context.userId === 'string'
				? context.userId
				: undefined

		const labels = { method: request.method, route, status: String(status) }
		httpRequestsTotal.inc(labels)
		if (!stream) httpRequestDuration.observe(labels, durationMs / 1000)

		logger.info(
			{
				requestId: meta.id,
				method: request.method,
				route,
				path,
				status,
				durationMs: Math.round(durationMs),
				userId,
				errorCode: meta.errorCode,
				stream: stream || undefined,
			},
			'request completed',
		)
	})
	.onError({ as: 'global' }, ({ request, path, route, code, error, set }) => {
		const meta = metaFor(request)
		meta.errorCode = String(code)
		const status =
			code === 'NOT_FOUND' ? 404 : statusCode(set.status as number | undefined)
		// 4xx is the client's problem and already visible on the access line.
		if (status < 500 && code !== 'UNKNOWN' && code !== 'INTERNAL_SERVER_ERROR')
			return
		logger.error(
			{
				requestId: meta.id,
				method: request.method,
				route: route || UNMATCHED_ROUTE,
				path,
				code,
				err: error instanceof Error ? error : new Error(String(error)),
			},
			'request failed',
		)
	})
