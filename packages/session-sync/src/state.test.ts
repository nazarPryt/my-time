import { expect, mock, test } from 'bun:test'
import { SessionSyncState } from './state'

test('reads current state only when the event stream is unavailable', async () => {
	const sync = new SessionSyncState()
	const read = mock(async () => 'server')
	expect(await sync.currentSession(() => 'cached', read)).toBe('server')
	sync.receiveSnapshot()
	expect(await sync.currentSession(() => 'pushed', read)).toBe('pushed')
	expect(read).toHaveBeenCalledTimes(1)
	sync.disconnect()
	expect(await sync.currentSession(() => 'cached', read)).toBe('server')
	expect(read).toHaveBeenCalledTimes(2)
})

test('new snapshots and lifetimes invalidate delayed responses', () => {
	const sync = new SessionSyncState()
	sync.invalidate()
	const checkpoint = sync.checkpoint()
	sync.receiveSnapshot()
	expect(sync.isCurrent(checkpoint)).toBe(false)
	expect(sync.isSameLifetime(checkpoint)).toBe(true)
	sync.reset()
	expect(sync.connected).toBe(false)
	expect(sync.isSameLifetime(checkpoint)).toBe(false)
})

test('disconnecting preserves valid HTTP confirmations', () => {
	const sync = new SessionSyncState()
	sync.receiveSnapshot()
	const checkpoint = sync.checkpoint()
	sync.disconnect()
	expect(sync.isCurrent(checkpoint)).toBe(true)
	expect(sync.connected).toBe(false)
})

test('a reconnect snapshot wins over a delayed HTTP read before a command', async () => {
	const sync = new SessionSyncState()
	let resolve!: (value: string) => void
	const result = sync.currentSession(
		() => 'pushed',
		() =>
			new Promise<string>((done) => {
				resolve = done
			}),
	)
	sync.receiveSnapshot()
	resolve('old')
	expect(await result).toBe('pushed')
})
