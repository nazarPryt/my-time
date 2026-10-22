import { afterEach, describe, expect, spyOn, test } from 'bun:test'
import { fetchStreamWithRefresh, fetchWithRefresh } from './fetch-with-refresh'
import { tokenStorage } from './token-storage'

const spies: { mockRestore(): void }[] = []
afterEach(() => {
	for (const spy of spies.splice(0)) spy.mockRestore()
})

function setup() {
	let token: string | null = 'old-token'
	const read = spyOn(tokenStorage, 'getAccessToken').mockImplementation(
		() => token,
	)
	const save = spyOn(tokenStorage, 'setAccessToken').mockImplementation(
		(next) => {
			token = next
		},
	)
	const clear = spyOn(tokenStorage, 'clear').mockImplementation(() => {
		token = null
	})
	const fetch = spyOn(globalThis, 'fetch')
	spies.push(read, save, clear, fetch)
	return { fetch, save, clear }
}

describe('shared HTTP and stream authentication', () => {
	test('rotates the refresh token once for concurrent HTTP and SSE 401s', async () => {
		const { fetch, save } = setup()
		let refreshes = 0
		fetch.mockImplementation(async (input, init) => {
			if (String(input).endsWith('/auth/refresh')) {
				refreshes++
				return Response.json({ tokens: { accessToken: 'new-token' } })
			}
			return new Headers(init?.headers).get('authorization') ===
				'Bearer new-token'
				? new Response('ok')
				: new Response(null, { status: 401 })
		})
		const init = { headers: { authorization: 'Bearer old-token' } }
		const results = await Promise.all([
			fetchWithRefresh('http://localhost/active', init),
			fetchStreamWithRefresh('http://localhost/events', init),
		])
		expect(results.map((response) => response.status)).toEqual([200, 200])
		expect(refreshes).toBe(1)
		expect(save).toHaveBeenCalledTimes(1)
	})

	test('keeps authentication on a transient refresh failure so SSE can retry', async () => {
		const { fetch, clear } = setup()
		fetch.mockImplementation(
			async (input) =>
				new Response(null, {
					status: String(input).endsWith('/auth/refresh') ? 503 : 401,
				}),
		)
		await expect(
			fetchStreamWithRefresh('http://localhost/events', {
				headers: { authorization: 'Bearer old-token' },
			}),
		).rejects.toThrow('HTTP 503')
		expect(clear).not.toHaveBeenCalled()
	})

	test('clears rejected authentication and does not retry with invalid tokens', async () => {
		const { fetch, clear } = setup()
		fetch.mockImplementation(async () => new Response(null, { status: 401 }))
		const result = await fetchStreamWithRefresh('http://localhost/events', {
			headers: { authorization: 'Bearer old-token' },
		})
		expect(result.status).toBe(401)
		expect(clear).toHaveBeenCalledTimes(1)
		expect(fetch).toHaveBeenCalledTimes(2)
	})

	test('uses a newly rotated token for a late 401 without another refresh', async () => {
		const { fetch, save } = setup()
		let requests = 0
		fetch.mockImplementation(async () => {
			if (++requests === 1) {
				tokenStorage.setAccessToken('new-token')
				return new Response(null, { status: 401 })
			}
			return new Response('ok')
		})
		const result = await fetchStreamWithRefresh('http://localhost/events', {
			headers: new Headers({
				authorization: 'Bearer old-token',
				accept: 'text/event-stream',
			}),
		})
		expect(result.status).toBe(200)
		expect(fetch).toHaveBeenCalledTimes(2)
		expect(new Headers(fetch.mock.calls[1]?.[1]?.headers).get('accept')).toBe(
			'text/event-stream',
		)
		expect(save).toHaveBeenCalledTimes(1)
	})
})

test('a pending refresh cannot restore tokens after sign-out', async () => {
	const { fetch, save } = setup()
	let finish!: (response: Response) => void
	let began!: () => void
	const refreshing = new Promise<void>((resolve) => {
		began = resolve
	})
	fetch.mockImplementation(async (input) => {
		if (String(input).endsWith('/auth/refresh')) {
			began()
			return new Promise<Response>((resolve) => {
				finish = resolve
			})
		}
		return new Response(null, { status: 401 })
	})
	const request = fetchStreamWithRefresh('http://localhost/events', {
		headers: { authorization: 'Bearer old-token' },
	})
	await refreshing
	tokenStorage.clear()
	finish(Response.json({ tokens: { accessToken: 'new-token' } }))
	expect((await request).status).toBe(401)
	expect(save).not.toHaveBeenCalled()
	expect(fetch).toHaveBeenCalledTimes(2)
})
