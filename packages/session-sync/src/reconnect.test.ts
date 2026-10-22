import { expect, mock, test } from 'bun:test'
import { reconnectSessions } from './reconnect'

test('retries dropped streams with backoff and supplies fresh snapshots', async () => {
	let stopped = false
	let attempts = 0
	const snapshots = mock(() => {})
	const wait = mock(async (_milliseconds: number) => {
		if (attempts === 2) stopped = true
	})
	await reconnectSessions({
		watch: async (onSession) => {
			attempts++
			onSession(null)
		},
		onSession: snapshots,
		onDisconnected: () => {},
		isAuthenticationError: () => false,
		isStopped: () => stopped,
		wait,
	})
	expect(attempts).toBe(2)
	expect(snapshots).toHaveBeenCalledTimes(2)
	expect(wait.mock.calls[0]?.[0]).toBeGreaterThanOrEqual(750)
	expect(wait.mock.calls[0]?.[0]).toBeLessThanOrEqual(1000)
	expect(wait.mock.calls[1]?.[0]).toBeGreaterThanOrEqual(1500)
})

test('authentication rejection ends retries', async () => {
	const failure = new Error('Sign in again')
	const disconnected = mock(() => {})
	const wait = mock(async (_milliseconds: number) => {})
	await reconnectSessions({
		watch: async () => {
			throw failure
		},
		onSession: () => {},
		onDisconnected: disconnected,
		isAuthenticationError: (error) => error === failure,
		isStopped: () => false,
		wait,
	})
	expect(disconnected).toHaveBeenCalledWith(failure)
	expect(wait).not.toHaveBeenCalled()
})

test('stopping discards late snapshots and prevents another reconnect', async () => {
	let stopped = false
	const snapshots = mock(() => {})
	const wait = mock(async (_milliseconds: number) => {})
	const disconnected = mock(() => {})
	await reconnectSessions({
		watch: async (onSession) => {
			stopped = true
			onSession(null)
		},
		onSession: snapshots,
		onDisconnected: disconnected,
		isAuthenticationError: () => false,
		isStopped: () => stopped,
		wait,
	})
	expect(snapshots).not.toHaveBeenCalled()
	expect(disconnected).not.toHaveBeenCalled()
	expect(wait).not.toHaveBeenCalled()
})
