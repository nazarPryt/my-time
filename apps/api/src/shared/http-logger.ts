import { Elysia } from 'elysia'
import { logger } from './logger'

// Attaches a per-request id + start time, then logs one line per request on
// completion (success or error) — method, path, status, duration. That single
// line is what Promtail/Loki ends up indexing, so keep the fields flat.
export const httpLoggerPlugin = new Elysia({ name: 'http-logger' })
	.derive({ as: 'global' }, () => ({
		requestId: crypto.randomUUID(),
		requestStart: performance.now(),
	}))
	.onAfterResponse(
		{ as: 'global' },
		({ request, path, set, requestId, requestStart }) => {
			logger.info({
				requestId,
				method: request.method,
				path,
				status: set.status,
				durationMs: Math.round(performance.now() - requestStart),
			})
		},
	)
	.onError({ as: 'global' }, ({ request, path, code, error, requestId }) => {
		logger.error(
			{
				requestId,
				method: request.method,
				path,
				code,
				err: error instanceof Error ? error : new Error(String(error)),
			},
			'request failed',
		)
	})
