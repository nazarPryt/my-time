import { describe, expect, test } from 'bun:test'
import {
	type IncomingMessage,
	isOwnMessage,
	type MessageTarget,
	postAndAwaitReply,
	type TypedMessage,
} from './request-reply'

const ORIGIN = 'http://localhost:5173'

/** In-memory stand-in for `window`: records posts, lets tests dispatch replies. */
function createFakeWindow() {
	const listeners = new Set<(event: IncomingMessage) => void>()
	const posted: { message: unknown; targetOrigin: string }[] = []

	const target: MessageTarget = {
		location: { origin: ORIGIN },
		postMessage: (message, targetOrigin) => {
			posted.push({ message, targetOrigin })
		},
		addEventListener: (_type, listener) => listeners.add(listener),
		removeEventListener: (_type, listener) => listeners.delete(listener),
	}

	/** Delivers a message as if posted by `source` (default: this window). */
	function dispatch(
		data: unknown,
		{ origin = ORIGIN, source = target as unknown } = {},
	) {
		for (const listener of [...listeners]) listener({ data, origin, source })
	}

	return { target, posted, listeners, dispatch }
}

describe('isOwnMessage', () => {
	const { target } = createFakeWindow()
	const event = (overrides: Partial<IncomingMessage>): IncomingMessage => ({
		data: { type: 'PONG' },
		origin: ORIGIN,
		source: target,
		...overrides,
	})

	test('accepts a same-window, same-origin message of the right type', () => {
		expect(isOwnMessage(target, event({}), 'PONG')).toBe(true)
	})

	test('rejects another type', () => {
		expect(isOwnMessage(target, event({}), 'OTHER')).toBe(false)
	})

	test('rejects a message from another window (e.g. an iframe)', () => {
		expect(isOwnMessage(target, event({ source: {} }), 'PONG')).toBe(false)
	})

	test('rejects a message from another origin', () => {
		expect(
			isOwnMessage(target, event({ origin: 'https://evil.example' }), 'PONG'),
		).toBe(false)
	})

	test.each([
		null,
		undefined,
		'PONG',
		42,
	])('rejects non-object data %p', (data) => {
		expect(isOwnMessage(target, event({ data }), 'PONG')).toBe(false)
	})
})

describe('postAndAwaitReply', () => {
	test('posts the message to its own origin', () => {
		const fake = createFakeWindow()
		void postAndAwaitReply<TypedMessage>(
			fake.target,
			{ type: 'PING' },
			'PONG',
			50,
		)
		expect(fake.posted).toEqual([
			{ message: { type: 'PING' }, targetOrigin: ORIGIN },
		])
	})

	test('resolves with the first matching reply', async () => {
		const fake = createFakeWindow()
		const reply = postAndAwaitReply<TypedMessage>(
			fake.target,
			{ type: 'PING' },
			'PONG',
			1000,
		)

		fake.dispatch({ type: 'PONG', value: 1 })
		fake.dispatch({ type: 'PONG', value: 2 })

		expect(await reply).toEqual({ type: 'PONG', value: 1 })
	})

	test('ignores unrelated and foreign messages while waiting', async () => {
		const fake = createFakeWindow()
		const reply = postAndAwaitReply<TypedMessage>(
			fake.target,
			{ type: 'PING' },
			'PONG',
			1000,
		)

		fake.dispatch({ type: 'NOISE' })
		fake.dispatch({ type: 'PONG', forged: true }, { source: {} })
		fake.dispatch({ type: 'PONG', ok: true })

		expect(await reply).toEqual({ type: 'PONG', ok: true })
	})

	test('resolves null after the timeout with no reply', async () => {
		const fake = createFakeWindow()
		expect(
			await postAndAwaitReply<TypedMessage>(
				fake.target,
				{ type: 'PING' },
				'PONG',
				10,
			),
		).toBeNull()
	})

	test('removes its listener after a reply', async () => {
		const fake = createFakeWindow()
		const reply = postAndAwaitReply<TypedMessage>(
			fake.target,
			{ type: 'PING' },
			'PONG',
			1000,
		)
		expect(fake.listeners.size).toBe(1)

		fake.dispatch({ type: 'PONG' })
		await reply

		expect(fake.listeners.size).toBe(0)
	})

	test('removes its listener after a timeout', async () => {
		const fake = createFakeWindow()
		await postAndAwaitReply<TypedMessage>(
			fake.target,
			{ type: 'PING' },
			'PONG',
			10,
		)
		expect(fake.listeners.size).toBe(0)
	})
})
