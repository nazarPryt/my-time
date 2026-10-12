import { createServer, type ServerResponse } from 'node:http'
import type { Page } from '@playwright/test'
import {
	API_PREFIX,
	DESKTOP_PRESENCE_EVENT,
	SESSION_STREAM_EVENT,
	type SessionResponse,
	TIME_TRACKER_ROUTES,
	type TimerSnapshot,
} from 'contracts'

export const API_TIME_EVENTS = `**${API_PREFIX}${TIME_TRACKER_ROUTES.prefix}${TIME_TRACKER_ROUTES.events}`

type StreamMock = {
	initial: SessionResponse | null
	timer?: TimerSnapshot
	desktopConnected: boolean
	clients: Set<ServerResponse>
	requests: number
	authorization: string | undefined
	delay: number
	failure: boolean
	acceptedToken?: string
}
const mocks = new WeakMap<Page, StreamMock>()

function snapshot(
	response: ServerResponse,
	session: SessionResponse | null,
	timer?: TimerSnapshot,
) {
	response.write(
		`event: ${SESSION_STREAM_EVENT}\ndata: ${JSON.stringify({ version: 1, activeSession: session, timer })}\n\n`,
	)
}

/** A real local HTTP stream: Playwright fulfill() would buffer and end SSE. */
export async function mockTimeEvents(
	page: Page,
	initial: SessionResponse | null,
	timer?: TimerSnapshot,
) {
	const existing = mocks.get(page)
	if (existing) {
		existing.initial = initial
		existing.timer = timer
		return
	}
	const mock: StreamMock = {
		initial,
		timer,
		desktopConnected: false,
		clients: new Set(),
		requests: 0,
		authorization: undefined,
		delay: 0,
		failure: false,
	}
	mocks.set(page, mock)
	const server = createServer((request, response) => {
		response.setHeader(
			'Access-Control-Allow-Origin',
			request.headers.origin ?? 'http://localhost:5173',
		)
		response.setHeader('Access-Control-Allow-Credentials', 'true')
		response.setHeader(
			'Access-Control-Allow-Headers',
			'authorization, accept, x-my-time-client',
		)
		if (request.method === 'OPTIONS') {
			response.writeHead(204)
			response.end()
			return
		}
		mock.requests++
		mock.authorization = request.headers.authorization
		if (
			mock.acceptedToken &&
			mock.authorization !== `Bearer ${mock.acceptedToken}`
		) {
			response.writeHead(401)
			response.end()
			return
		}
		if (mock.failure) {
			response.writeHead(503)
			response.end()
			return
		}
		response.writeHead(200, {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-store',
		})
		response.flushHeaders()
		mock.clients.add(response)
		const timer = setTimeout(() => {
			snapshot(response, mock.initial, mock.timer)
			response.write(
				`event: ${DESKTOP_PRESENCE_EVENT}\ndata: ${JSON.stringify({ connected: mock.desktopConnected })}\n\n`,
			)
		}, mock.delay)
		const heartbeat = setInterval(
			() => response.write(': heartbeat\n\n'),
			20_000,
		)
		response.on('close', () => {
			clearTimeout(timer)
			clearInterval(heartbeat)
			mock.clients.delete(response)
		})
	})
	await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
	const address = server.address()
	if (!address || typeof address === 'string')
		throw new Error('Missing test stream address')
	await page.route(API_TIME_EVENTS, (route) =>
		route.continue({ url: `http://127.0.0.1:${address.port}/events` }),
	)
	page.on('close', () => {
		server.closeAllConnections()
		server.close()
	})
}

export function pushTimeSession(
	page: Page,
	session: SessionResponse | null,
	timer?: TimerSnapshot,
) {
	const mock = mocks.get(page)
	if (!mock) throw new Error('Session stream mock is not initialized')
	mock.initial = session
	mock.timer = timer
	for (const client of mock.clients) snapshot(client, session, timer)
}

export function failTimeEvents(page: Page) {
	const mock = mocks.get(page)
	if (!mock) throw new Error('Session stream mock is not initialized')
	mock.failure = true
	for (const client of mock.clients) client.destroy()
}

export function delayTimeEvents(page: Page, milliseconds: number) {
	const mock = mocks.get(page)
	if (!mock) throw new Error('Session stream mock is not initialized')
	mock.delay = milliseconds
}

export function recoverTimeEvents(page: Page, session: SessionResponse | null) {
	const mock = mocks.get(page)
	if (!mock) throw new Error('Session stream mock is not initialized')
	mock.failure = false
	mock.initial = session
}

export function timeStreamStats(page: Page) {
	const mock = mocks.get(page)
	return {
		requests: mock?.requests ?? 0,
		clients: mock?.clients.size ?? 0,
		authorization: mock?.authorization,
	}
}

export function pushDesktopPresence(page: Page, connected: boolean) {
	const mock = mocks.get(page)
	if (!mock) throw new Error('Session stream mock is not initialized')
	mock.desktopConnected = connected
	for (const client of mock.clients)
		client.write(
			`event: ${DESKTOP_PRESENCE_EVENT}\ndata: ${JSON.stringify({ connected })}\n\n`,
		)
}

/** Simulate credentials expiring while a live connection is interrupted. */
export function expireTimeEvents(page: Page, acceptedToken: string) {
	const mock = mocks.get(page)
	if (!mock) throw new Error('Session stream mock is not initialized')
	mock.acceptedToken = acceptedToken
	for (const client of mock.clients) client.destroy()
}
