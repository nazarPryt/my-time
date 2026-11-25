import { describe, expect, it } from 'bun:test'
import { API_PREFIX } from '@my-time/contracts'
import { app } from '@/app'
import { REQUEST_ID_HEADER } from '../http-logger'
import { metricsRegistry } from '../metrics'

async function requestCount(labels: Record<string, string>): Promise<number> {
	const metric = await metricsRegistry
		.getSingleMetric('http_requests_total')
		?.get()
	const match = metric?.values.find((v) =>
		Object.entries(labels).every(([k, value]) => v.labels[k] === value),
	)
	return match?.value ?? 0
}

// Elysia runs afterResponse hooks after handle() resolves.
async function waitForCount(
	labels: Record<string, string>,
	expected: number,
): Promise<number> {
	for (let i = 0; i < 50; i++) {
		const count = await requestCount(labels)
		if (count >= expected) return count
		await Bun.sleep(5)
	}
	return requestCount(labels)
}

describe('http logger', () => {
	it('returns a request id on every response', async () => {
		const ok = await app.handle(new Request(`http://localhost${API_PREFIX}/`))
		const missing = await app.handle(
			new Request(`http://localhost${API_PREFIX}/does-not-exist`),
		)
		expect(ok.headers.get(REQUEST_ID_HEADER)).toBeString()
		expect(missing.status).toBe(404)
		expect(missing.headers.get(REQUEST_ID_HEADER)).toBeString()
		expect(ok.headers.get(REQUEST_ID_HEADER)).not.toBe(
			missing.headers.get(REQUEST_ID_HEADER),
		)
	})

	it('labels metrics with the route pattern, never the raw path', async () => {
		const route = `${API_PREFIX}/time-tracker/:id`
		const before = await requestCount({ route, status: '401' })
		await app.handle(
			new Request(`http://localhost${API_PREFIX}/time-tracker/abc-123`, {
				method: 'DELETE',
			}),
		)
		expect(await waitForCount({ route, status: '401' }, before + 1)).toBe(
			before + 1,
		)
	})

	it('groups unknown paths under one "unmatched" route', async () => {
		const before = await requestCount({ route: 'unmatched', status: '404' })
		await app.handle(new Request('http://localhost/wp-admin/setup.php'))
		expect(
			await waitForCount({ route: 'unmatched', status: '404' }, before + 1),
		).toBe(before + 1)
	})

	it('reports the database in /health', async () => {
		const response = await app.handle(
			new Request(`http://localhost${API_PREFIX}/health`),
		)
		expect(response.status).toBe(200)
		expect(await response.json()).toEqual({ status: 'ok' })
	})
})
