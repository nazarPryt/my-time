import { describe, expect, mock, test } from 'bun:test'
import type { SessionResponse } from 'contracts'
import { AuthenticationError } from '@/dal/api-client'
import { TrackerController } from './tracker-controller'

const session: SessionResponse = {
	id: 'session-1',
	type: 'work',
	startedAt: new Date('2026-10-08T08:00:00Z'),
	endedAt: null,
	abandonedAt: null,
}

function fixture(initial: SessionResponse | null = null) {
	let active = initial
	const api = {
		getActive: mock(async () => active),
		start: mock(async () => {
			active = session
			return session
		}),
		end: mock(async (_id: string) => {
			active = null
		}),
		dispose: mock(() => {}),
	}
	const changed = mock(() => {})
	return {
		api,
		changed,
		tracker: new TrackerController(api, changed),
		setActive: (next: SessionResponse | null) => {
			active = next
		},
	}
}

describe('desktop session controller', () => {
	test('starts and saves a session through the API', async () => {
		const { tracker, api } = fixture()
		await tracker.refresh()
		await tracker.start()
		expect(tracker.state.status).toBe('working')
		await tracker.stop()
		expect(api.end).toHaveBeenCalledWith(session.id)
		expect(tracker.state.status).toBe('ready')
		expect(tracker.state.activeSession).toBeNull()
	})

	test('restores a session started in the web app and does not restart it', async () => {
		const { tracker, api } = fixture(session)
		await tracker.refresh()
		await tracker.start()
		expect(tracker.state.activeSession).toEqual(session)
		expect(api.start).not.toHaveBeenCalled()
	})

	test('stop acts on the current server session after a change in another client', async () => {
		const { tracker, api, setActive } = fixture(session)
		await tracker.refresh()
		setActive({ ...session, id: 'new-session' })
		await tracker.stop()
		expect(api.end).toHaveBeenCalledWith('new-session')
	})

	test('polling reconciles a stop made in the web app', async () => {
		const { tracker, setActive } = fixture(session)
		await tracker.refresh()
		setActive(null)
		await tracker.refresh()
		expect(tracker.state.status).toBe('ready')
	})

	test('failed stop preserves the confirmed running session and can be retried', async () => {
		const { tracker, api } = fixture(session)
		await tracker.refresh()
		api.end.mockRejectedValueOnce(new Error('Server unavailable'))
		await tracker.stop()
		expect(tracker.state.status).toBe('offline')
		expect(tracker.state.activeSession).toEqual(session)
		expect(tracker.state.busy).toBe(false)
		await tracker.stop()
		expect(tracker.state.status).toBe('ready')
	})

	test('serializes double clicks and concurrent polling', async () => {
		const { tracker, api } = fixture()
		await Promise.all([tracker.start(), tracker.start(), tracker.refresh()])
		expect(api.start).toHaveBeenCalledTimes(1)
		expect(api.getActive).toHaveBeenCalledTimes(1)
	})

	test('does not publish a pending result after the extension is disabled', async () => {
		const { tracker, api, changed } = fixture()
		let resolve!: (active: SessionResponse | null) => void
		api.getActive.mockImplementation(
			() =>
				new Promise((done) => {
					resolve = done
				}),
		)
		const pending = tracker.refresh()
		tracker.dispose()
		const count = changed.mock.calls.length
		resolve(session)
		await pending
		expect(changed).toHaveBeenCalledTimes(count)
		expect(api.dispose).toHaveBeenCalledTimes(1)
	})

	test('expired authentication asks the user to reconnect', async () => {
		const { tracker, api } = fixture()
		api.getActive.mockRejectedValueOnce(
			new AuthenticationError('Sign in again'),
		)
		await tracker.refresh()
		expect(tracker.state.status).toBe('signed-out')
	})
})
