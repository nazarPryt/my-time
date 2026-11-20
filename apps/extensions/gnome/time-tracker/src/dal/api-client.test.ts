import { describe, expect, mock, test } from 'bun:test'
import {
	ApiClient,
	AuthenticationError,
	type HttpResponse,
	type Tokens,
} from './api-client'
import type { SessionStreamTransport, StreamConnection } from './session-stream'

const oldTokens: Tokens = {
	accessToken: 'old-access',
	refreshToken: 'old-refresh',
}
const newTokens: Tokens = {
	accessToken: 'new-access',
	refreshToken: 'new-refresh',
}
const wireSession = {
	id: 's1',
	type: 'work',
	startedAt: '2026-10-08T08:00:00Z',
	endedAt: null,
	abandonedAt: null,
}

function fixture(
	responses: HttpResponse[],
	tokens: Tokens | null = oldTokens,
	streams?: SessionStreamTransport,
) {
	const transport = {
		send: mock(
			async (
				_method: string,
				_path: string,
				_body?: unknown,
				_accessToken?: string,
			): Promise<HttpResponse> => {
				const next = responses.shift()
				if (!next) throw new Error('Unexpected request')
				return next
			},
		),
		dispose: mock(() => {}),
	}
	const storage = {
		load: mock(async () => tokens),
		save: mock(async (_next: Tokens) => {}),
		clear: mock(async () => {}),
		dispose: mock(() => {}),
	}
	return {
		transport,
		storage,
		client: new ApiClient(transport, storage, streams),
	}
}

describe('desktop API client', () => {
	test('validates credentials and stores tokens returned by desktop-compatible login', async () => {
		const { client, transport, storage } = fixture(
			[{ status: 200, body: newTokens }],
			null,
		)
		await client.login({
			email: 'person@example.com',
			password: 'test-password',
		})
		expect(transport.send).toHaveBeenCalledWith(
			'POST',
			'/auth/login-extension',
			{ email: 'person@example.com', password: 'test-password' },
		)
		expect(storage.save).toHaveBeenCalledWith(newTokens)
	})

	test('refreshes on 401, saves the rotated refresh token, and retries once', async () => {
		const { client, transport, storage } = fixture([
			{ status: 401, body: null },
			{ status: 200, body: newTokens },
			{ status: 200, body: wireSession },
		])
		const active = await client.getActive()
		expect(active?.startedAt).toBeInstanceOf(Date)
		expect(storage.save).toHaveBeenCalledWith(newTokens)
		expect(transport.send.mock.calls[1]).toEqual([
			'POST',
			'/auth/refresh-extension',
			{ refreshToken: 'old-refresh' },
		])
		expect(transport.send.mock.calls[2]).toEqual([
			'GET',
			'/time-tracker/active',
			undefined,
			'new-access',
		])
	})

	test('shares a single token rotation across simultaneous unauthorized requests', async () => {
		const { client, transport, storage } = fixture([])
		transport.send.mockImplementation(
			async (_method, path, _body, accessToken) => {
				if (path === '/auth/refresh-extension')
					return { status: 200, body: newTokens }
				return { status: accessToken === 'new-access' ? 200 : 401, body: null }
			},
		)
		await Promise.all([client.getActive(), client.getActive()])
		expect(
			transport.send.mock.calls.filter(
				(call) => call[1] === '/auth/refresh-extension',
			),
		).toHaveLength(1)
		expect(storage.save).toHaveBeenCalledTimes(1)
	})

	test('clears expired tokens and requires reconnecting after refresh is rejected', async () => {
		const { client, storage, transport } = fixture([
			{ status: 401, body: null },
			{ status: 401, body: null },
		])
		await expect(client.getActive()).rejects.toBeInstanceOf(AuthenticationError)
		expect(storage.clear).toHaveBeenCalledTimes(1)
		expect(transport.send).toHaveBeenCalledTimes(2)
	})

	test('keeps credentials on a transient refresh server failure', async () => {
		const { client, storage } = fixture([
			{ status: 401, body: null },
			{ status: 503, body: null },
		])
		await expect(client.getActive()).rejects.toThrow('HTTP 503')
		expect(storage.clear).not.toHaveBeenCalled()
	})

	test('does not mistake malformed successful responses for an idle session', async () => {
		const { client } = fixture([{ status: 200, body: { unexpected: true } }])
		await expect(client.getActive()).rejects.toThrow()
	})

	test('does not send requests without a stored account', async () => {
		const { client, transport } = fixture([], null)
		await expect(client.getActive()).rejects.toBeInstanceOf(AuthenticationError)
		expect(transport.send).not.toHaveBeenCalled()
	})

	test('disposes HTTP and keyring operations and rejects further calls', async () => {
		const { client, transport, storage } = fixture([])
		client.dispose()
		await expect(client.getActive()).rejects.toThrow('Connection closed')
		expect(transport.dispose).toHaveBeenCalledTimes(1)
		expect(storage.dispose).toHaveBeenCalledTimes(1)
	})

	test('consumes snapshots and heartbeats without making HTTP reads', async () => {
		const chunks = [
			new TextEncoder().encode(
				': heartbeat\n\nevent: session-state\ndata: {"version":1,"activeSession":null}\n\n',
			),
			null,
		]
		const connection: StreamConnection = {
			status: 200,
			contentType: 'text/event-stream; charset=utf-8',
			read: mock(async () => chunks.shift() ?? null),
			close: mock(() => {}),
		}
		const streams = {
			open: mock(async (_path: string, _token: string) => connection),
			dispose: mock(() => {}),
		}
		const { client, transport } = fixture([], oldTokens, streams)
		const received = mock((_session: unknown) => {})
		await client.watch(received)
		expect(received).toHaveBeenCalledWith(null)
		expect(streams.open).toHaveBeenCalledWith(
			'/time-tracker/events',
			'old-access',
		)
		expect(transport.send).not.toHaveBeenCalled()
		expect(connection.close).toHaveBeenCalledTimes(1)
		client.dispose()
		expect(streams.dispose).toHaveBeenCalledTimes(1)
	})

	test('shares token refresh between unauthorized HTTP and SSE connections', async () => {
		const closed = mock(() => {})
		const streams = {
			open: mock(
				async (_path: string, token: string): Promise<StreamConnection> => ({
					status: token === 'old-access' ? 401 : 200,
					contentType: 'text/event-stream',
					read: async () => null,
					close: closed,
				}),
			),
			dispose: mock(() => {}),
		}
		const { client, transport, storage } = fixture([], oldTokens, streams)
		transport.send.mockImplementation(async (_method, path, _body, token) => {
			if (path === '/auth/refresh-extension')
				return { status: 200, body: newTokens }
			return { status: token === 'new-access' ? 200 : 401, body: null }
		})
		await Promise.all([client.watch(() => {}), client.getActive()])
		expect(storage.load).toHaveBeenCalledTimes(1)
		expect(storage.save).toHaveBeenCalledTimes(1)
		expect(
			transport.send.mock.calls.filter(
				(call) => call[1] === '/auth/refresh-extension',
			),
		).toHaveLength(1)
		expect(streams.open.mock.calls.map((call) => call[1])).toEqual([
			'old-access',
			'new-access',
		])
	})

	test('closes non-stream responses and preserves credentials on server failure', async () => {
		for (const [status, contentType] of [
			[503, 'application/json'],
			[200, 'application/json'],
		] as const) {
			const close = mock(() => {})
			const streams = {
				open: async () => ({
					status,
					contentType,
					read: async () => null,
					close,
				}),
				dispose: () => {},
			}
			const { client, storage } = fixture([], oldTokens, streams)
			await expect(client.watch(() => {})).rejects.toThrow()
			expect(close).toHaveBeenCalledTimes(1)
			expect(storage.clear).not.toHaveBeenCalled()
		}
	})

	test('ignores bytes arriving after disposal', async () => {
		let resolve!: (chunk: Uint8Array | null) => void
		let reading!: () => void
		const readStarted = new Promise<void>((done) => {
			reading = done
		})
		const close = mock(() => {})
		const streams = {
			open: async () => ({
				status: 200,
				contentType: 'text/event-stream',
				close,
				read: () =>
					new Promise<Uint8Array | null>((done) => {
						resolve = done
						reading()
					}),
			}),
			dispose: mock(() => {}),
		}
		const { client } = fixture([], oldTokens, streams)
		const received = mock(() => {})
		const watching = client.watch(received)
		await readStarted
		client.dispose()
		resolve(
			new TextEncoder().encode(
				'event: session-state\ndata: {"version":1,"activeSession":null}\n\n',
			),
		)
		await expect(watching).rejects.toThrow('Connection closed')
		expect(received).not.toHaveBeenCalled()
		expect(close).toHaveBeenCalledTimes(1)
	})
})
