import { describe, expect, mock, test } from 'bun:test'
import type { SessionResponse, TimerSnapshot, TimerState } from 'contracts'
import { AuthenticationError } from '@/dal/api-client'
import { reconnectDelay, TrackerController } from './tracker-controller'

const session: SessionResponse = {
	id: 'session-1',
	type: 'work',
	startedAt: new Date('2026-10-08T08:00:00Z'),
	endedAt: null,
	abandonedAt: null,
}

function fixture(initial: SessionResponse | null = null) {
	let active = initial
	let emit:
		| ((session: SessionResponse | null, timer?: TimerSnapshot) => void)
		| undefined
	let finish: (() => void) | undefined
	const api = {
		getActive: mock(async () => active),
		start: mock(async () => {
			active = session
			return session
		}),
		end: mock(async (_id: string) => {
			active = null
		}),
		watch: mock((onSession: (session: SessionResponse | null) => void) => {
			emit = onSession
			onSession(active)
			return new Promise<void>((resolve) => {
				finish = resolve
			})
		}),
		dispose: mock(() => {
			finish?.()
		}),
	}
	const changed = mock(() => {})
	return {
		api,
		changed,
		tracker: new TrackerController(api, changed),
		setActive: (next: SessionResponse | null) => {
			active = next
		},
		emit: (next: SessionResponse | null, timer?: TimerSnapshot) => {
			active = next
			emit?.(next, timer)
		},
		finish: () => finish?.(),
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

	test('manual refresh reconciles a stop made in the web app', async () => {
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

	test('serializes double clicks and queues a concurrent refresh', async () => {
		const { tracker, api } = fixture()
		await Promise.all([tracker.start(), tracker.start(), tracker.refresh()])
		expect(api.start).toHaveBeenCalledTimes(1)
		expect(api.getActive).toHaveBeenCalledTimes(2)
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

	test('pushes update the session without idle HTTP reads', async () => {
		const { tracker, api, emit } = fixture()
		const retry = { wait: mock(async () => {}), dispose: mock(() => {}) }
		const connected = tracker.connect(retry)
		emit(session)
		expect(tracker.state.activeSession).toEqual(session)
		emit(null)
		expect(tracker.state.status).toBe('ready')
		expect(api.getActive).not.toHaveBeenCalled()
		tracker.dispose()
		await connected
		expect(retry.dispose).toHaveBeenCalledTimes(1)
	})

	test('does not overwrite a newer push with a delayed HTTP result', async () => {
		const { tracker, api, emit } = fixture()
		const connected = tracker.connect({
			wait: async () => {},
			dispose: () => {},
		})
		let resolve!: (value: SessionResponse | null) => void
		api.getActive.mockImplementationOnce(
			() =>
				new Promise((done) => {
					resolve = done
				}),
		)
		const pending = tracker.refresh()
		emit(session)
		resolve(null)
		await pending
		expect(tracker.state.activeSession).toEqual(session)
		expect(api.getActive).toHaveBeenCalledTimes(1)
		tracker.dispose()
		await connected
	})

	test('uses pushes during start and stop without follow-up reads', async () => {
		const { tracker, api, emit } = fixture()
		const connected = tracker.connect({
			wait: async () => {},
			dispose: () => {},
		})
		api.start.mockImplementationOnce(async () => {
			emit(session)
			return session
		})
		api.end.mockImplementationOnce(async () => {
			emit(null)
		})
		await tracker.start()
		expect(tracker.state.activeSession).toEqual(session)
		await tracker.stop()
		expect(tracker.state.activeSession).toBeNull()
		expect(api.getActive).not.toHaveBeenCalled()
		expect(api.start).toHaveBeenCalledTimes(1)
		expect(api.end).toHaveBeenCalledTimes(1)
		tracker.dispose()
		await connected
	})

	test('preserves a newer session pushed while stop is completing', async () => {
		const { tracker, api, emit } = fixture(session)
		const connected = tracker.connect({
			wait: async () => {},
			dispose: () => {},
		})
		const newer = { ...session, id: 'new-session' }
		api.end.mockImplementationOnce(async () => {
			emit(null)
			emit(newer)
		})
		await tracker.stop()
		expect(tracker.state.activeSession).toEqual(newer)
		expect(api.getActive).not.toHaveBeenCalled()
		tracker.dispose()
		await connected
	})

	test('retains confirmed state on disconnect and restores it on reconnect', async () => {
		const { tracker, api, finish, setActive } = fixture(session)
		let resume!: () => void
		let waiting!: () => void
		const enteredRetry = new Promise<void>((resolve) => {
			waiting = resolve
		})
		const retry = {
			wait: mock(
				() =>
					new Promise<void>((resolve) => {
						resume = resolve
						waiting()
					}),
			),
			dispose: () => resume?.(),
		}
		const connected = tracker.connect(retry)
		finish()
		await enteredRetry
		expect(tracker.state.status).toBe('offline')
		expect(tracker.state.activeSession).toEqual(session)
		setActive(null)
		resume()
		await Promise.resolve()
		expect(api.watch).toHaveBeenCalledTimes(2)
		expect(tracker.state.status).toBe('ready')
		tracker.dispose()
		await connected
	})

	test('stops reconnecting after authentication rejection', async () => {
		const { tracker, api } = fixture(session)
		api.watch.mockRejectedValueOnce(new AuthenticationError('Sign in again'))
		const retry = { wait: mock(async () => {}), dispose: mock(() => {}) }
		await tracker.connect(retry)
		expect(tracker.state.status).toBe('signed-out')
		expect(retry.wait).not.toHaveBeenCalled()
		tracker.dispose()
	})

	test('uses bounded jittered backoff', () => {
		expect(reconnectDelay(0, 0)).toBe(750)
		expect(reconnectDelay(1, 1)).toBe(2000)
		expect(reconnectDelay(100, 1)).toBe(30_000)
	})
})

function timerSnapshot(running: boolean, seconds: number): TimerSnapshot {
	return {
		asOf: new Date('2026-10-12T10:00:00Z'),
		dayStartedAt: new Date('2026-10-12T00:00:00Z'),
		nextDayAt: new Date('2026-10-13T00:00:00Z'),
		timeZone: 'UTC',
		dailyWorkSeconds: seconds,
		sessionWorkSeconds: running ? 60 : 0,
		running,
	}
}

test('daily mode keeps the stopped total and mode changes make no API calls', async () => {
	const f = fixture()
	const connected = f.tracker.connect({
		wait: async () => {},
		dispose: () => {},
	})
	f.emit(null, timerSnapshot(false, 300))
	expect(f.tracker.displayedSeconds('daily')).toBe(300)
	expect(f.tracker.displayedSeconds('session')).toBe(0)
	f.emit(session, timerSnapshot(true, 360))
	expect(f.tracker.displayedSeconds('daily')).toBe(360)
	expect(f.tracker.displayedSeconds('session')).toBe(60)
	expect(f.api.getActive).not.toHaveBeenCalled()
	f.tracker.dispose()
	await connected
})

test('a late timer read cannot replace a newer pushed total', async () => {
	const f = fixture()
	let resolve!: (state: TimerState) => void
	const getTimer = mock(
		() =>
			new Promise<TimerState>((done) => {
				resolve = done
			}),
	)
	const tracker = new TrackerController({ ...f.api, getTimer }, () => {})
	const connected = tracker.connect({ wait: async () => {}, dispose: () => {} })
	const reading = tracker.refresh()
	f.emit(session, timerSnapshot(true, 900))
	resolve({ activeSession: null, timer: timerSnapshot(false, 100) })
	await reading
	expect(tracker.displayedSeconds('daily')).toBe(900)
	expect(tracker.state.activeSession?.id).toBe(session.id)
	tracker.dispose()
	await connected
})

test('a stale timer read failure cannot mark a newly confirmed snapshot offline', async () => {
	const f = fixture()
	let reject!: (error: Error) => void
	const getTimer = mock(
		() =>
			new Promise<TimerState>((_done, fail) => {
				reject = fail
			}),
	)
	const tracker = new TrackerController({ ...f.api, getTimer }, () => {})
	const connected = tracker.connect({ wait: async () => {}, dispose: () => {} })
	const reading = tracker.refresh()
	f.emit(session, timerSnapshot(true, 900))
	reject(new Error('Old read failed'))
	await reading
	expect(tracker.state.status).toBe('working')
	expect(tracker.displayedSeconds('daily')).toBe(900)
	tracker.dispose()
	await connected
})

test('does not start a session after disposal during the pre-command read', async () => {
	const { tracker, api } = fixture()
	let resolve!: (session: SessionResponse | null) => void
	api.getActive.mockImplementationOnce(
		() =>
			new Promise((done) => {
				resolve = done
			}),
	)
	const pending = tracker.start()
	tracker.dispose()
	resolve(null)
	await pending
	expect(api.start).not.toHaveBeenCalled()
})

test('confirms a successful Stop even when streaming disconnects during it', async () => {
	const { tracker, api, finish } = fixture(session)
	let resume: (() => void) | undefined
	const connected = tracker.connect({
		wait: () =>
			new Promise<void>((resolve) => {
				resume = resolve
			}),
		dispose: () => resume?.(),
	})
	api.end.mockImplementationOnce(async () => {
		finish()
		await Promise.resolve()
	})
	api.getActive.mockResolvedValue(null)
	await tracker.stop()
	expect(tracker.state.activeSession).toBeNull()
	tracker.dispose()
	await connected
})
