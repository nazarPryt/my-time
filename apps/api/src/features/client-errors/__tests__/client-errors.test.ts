import { describe, expect, it } from 'bun:test'
import { API_PREFIX, type ClientErrorReport } from '@my-time/contracts'
import { app } from '@/app'
import { createRateLimiter } from '../rate-limit'

const REPORT: ClientErrorReport = {
	source: 'web',
	message: 'TypeError: x is undefined',
	stack: 'at foo (app.js:1:1)',
	url: 'https://example.com/dashboard',
	appVersion: '1.2.3',
}

function post(body: unknown, ip: string) {
	return app.handle(
		new Request(`http://localhost${API_PREFIX}/client-errors/`, {
			method: 'POST',
			headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
			body: JSON.stringify(body),
		}),
	)
}

describe('POST /client-errors', () => {
	it('accepts a report without authentication', async () => {
		expect((await post(REPORT, '10.0.0.1')).status).toBe(204)
	})

	it('rejects an unknown source or an oversized message', async () => {
		expect((await post({ ...REPORT, source: 'cli' }, '10.0.0.2')).status).toBe(
			422,
		)
		expect(
			(await post({ ...REPORT, message: 'x'.repeat(1001) }, '10.0.0.2')).status,
		).toBe(422)
	})

	it('rate limits one client without blocking others', async () => {
		const statuses: number[] = []
		for (let i = 0; i < 31; i++)
			statuses.push((await post(REPORT, '10.0.0.3')).status)
		expect(statuses.slice(0, 30).every((s) => s === 204)).toBe(true)
		expect(statuses[30]).toBe(429)
		expect((await post(REPORT, '10.0.0.4')).status).toBe(204)
	})
})

describe('createRateLimiter', () => {
	it('enforces the per-key and total caps and resets each minute', () => {
		const allow = createRateLimiter(2, 3)
		expect([allow('a', 0), allow('a', 1), allow('a', 2)]).toEqual([
			true,
			true,
			false,
		])
		expect([allow('b', 3), allow('c', 4)]).toEqual([true, false])
		expect(allow('a', 60_000)).toBe(true)
	})
})
