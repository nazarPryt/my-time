import { describe, expect, test } from 'bun:test'
import { SessionStreamParser } from './parser'

const encoder = new TextEncoder()
const session = {
	id: 'session-🙂',
	type: 'work',
	startedAt: '2026-10-08T08:00:00Z',
	endedAt: null,
	abandonedAt: null,
}

describe('session SSE parser', () => {
	test('handles every byte boundary, UTF-8, CRLF, comments, and repeated snapshots', () => {
		const received: unknown[] = []
		const parser = new SessionStreamParser((state) => received.push(state))
		const wire = encoder.encode(
			`: heartbeat\r\n\r\nevent: session-state\r\ndata: ${JSON.stringify({ version: 1, activeSession: session })}\r\n\r\nevent: session-state\ndata: {"version":1,\ndata: "activeSession":null}\n\n`,
		)
		for (const byte of wire) parser.push(new Uint8Array([byte]))
		expect(received).toHaveLength(2)
		expect(received[0]).toEqual({
			...session,
			startedAt: new Date(session.startedAt),
		})
		expect(received[1]).toBeNull()
	})

	test('ignores unknown events and does not dispatch incomplete frames', () => {
		const received: unknown[] = []
		const parser = new SessionStreamParser((state) => received.push(state))
		parser.push(encoder.encode('event: future-event\ndata: invalid JSON\n\n'))
		parser.push(
			encoder.encode(
				'event: session-state\ndata: {"version":1,"activeSession":null}\n',
			),
		)
		expect(received).toEqual([])
		parser.push(encoder.encode('\n'))
		expect(received).toEqual([null])
	})

	test('rejects malformed state and unsupported protocol versions', () => {
		for (const data of [
			'garbage',
			'{"version":2,"activeSession":null}',
			'{"version":1,"activeSession":{}}',
		]) {
			const parser = new SessionStreamParser(() => {})
			expect(() =>
				parser.push(encoder.encode(`event: session-state\ndata: ${data}\n\n`)),
			).toThrow()
		}
	})

	test('bounds incomplete event buffers', () => {
		const parser = new SessionStreamParser(() => {})
		expect(() =>
			parser.push(encoder.encode('data: '.concat('x'.repeat(65_536)))),
		).toThrow('too large')
	})
})

describe('web session SSE parser', () => {
	test('handles split UTF-8, CRLF, multiline data, comments, and idle snapshots', () => {
		const sessions: unknown[] = []
		const parser = new SessionStreamParser((session) => sessions.push(session))
		const active = {
			id: 'session-🙂',
			type: 'work',
			startedAt: '2026-10-11T08:00:00Z',
			endedAt: null,
			abandonedAt: null,
		}
		const wire = new TextEncoder().encode(
			`: heartbeat\r\n\r\nevent: session-state\r\ndata: {"version":1,\r\ndata: "activeSession":${JSON.stringify(active)}}\r\n\r\nevent: session-state\ndata: {"version":1,"activeSession":null}\n\n`,
		)
		for (const byte of wire) parser.push(new Uint8Array([byte]))
		expect(sessions).toEqual([
			{ ...active, startedAt: new Date(active.startedAt) },
			null,
		])
	})

	test('ignores unknown events and waits for a complete frame', () => {
		const sessions: unknown[] = []
		const parser = new SessionStreamParser((session) => sessions.push(session))
		parser.push(
			new TextEncoder().encode(
				'event: future\ndata: invalid\n\nevent: session-state\ndata: {"version":1,"activeSession":null}\n',
			),
		)
		expect(sessions).toEqual([])
		parser.push(new TextEncoder().encode('\n'))
		expect(sessions).toEqual([null])
	})

	test('rejects malformed payloads and bounds incomplete events', () => {
		for (const data of [
			'invalid',
			'{"version":2,"activeSession":null}',
			'{"version":1,"activeSession":{}}',
		]) {
			const parser = new SessionStreamParser(() => {})
			expect(() =>
				parser.push(
					new TextEncoder().encode(`event: session-state\ndata: ${data}\n\n`),
				),
			).toThrow()
		}
		const parser = new SessionStreamParser(() => {})
		expect(() =>
			parser.push(new TextEncoder().encode('x'.repeat(65_537))),
		).toThrow('too large')
	})
})

test('desktop presence events do not dispatch session snapshots', () => {
	const sessions: unknown[] = []
	const presence: unknown[] = []
	const parser = new SessionStreamParser(
		(value) => sessions.push(value),
		(value) => presence.push(value),
	)
	const wire = encoder.encode(
		'event: desktop-presence\ndata: {"connected":true}\n\nevent: desktop-presence\ndata: {"connected":false}\n\n',
	)
	for (const byte of wire) parser.push(new Uint8Array([byte]))
	expect(presence).toEqual([{ connected: true }, { connected: false }])
	expect(sessions).toEqual([])
	// Desktop clients without a presence callback keep ignoring this event.
	expect(() =>
		new SessionStreamParser(() => {}).push(
			encoder.encode('event: desktop-presence\ndata: future-format\n\n'),
		),
	).not.toThrow()
})
