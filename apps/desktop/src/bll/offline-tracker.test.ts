import { expect, mock, test } from 'bun:test'
import type { OfflineJournal, SessionResponse, TimerState } from 'contracts'
import { addMinutes } from 'date-fns'
import { ConnectionError } from '@/dal/api-client'
import { emptyOfflineJournal } from '@/dal/offline-store'
import { OfflineTracker } from './offline-tracker'
import { TrackerController } from './tracker-controller'

const start = new Date('2026-10-12T10:00:00Z')
const ownerId = '00000000-0000-4000-8000-000000000001'
const synced: TimerState = {
	activeSession: null,
	timer: {
		asOf: addMinutes(start, 35),
		dayStartedAt: new Date('2026-10-12T00:00:00Z'),
		nextDayAt: new Date('2026-10-13T00:00:00Z'),
		timeZone: 'UTC',
		dailyWorkSeconds: 2100,
		sessionWorkSeconds: 0,
		running: false,
	},
}

function fixture() {
	let journal: OfflineJournal = emptyOfflineJournal()
	let now = start
	let id = 0
	const store = {
		load: () => structuredClone(journal),
		save: mock((next: OfflineJournal) => {
			journal = structuredClone(next)
		}),
	}
	const restore = () =>
		new OfflineTracker(
			store,
			ownerId,
			() => `00000000-0000-4000-8000-${String(++id).padStart(12, '0')}`,
			() => now,
		)
	return {
		store,
		restore,
		advance: (minutes: number) => {
			now = addMinutes(start, minutes)
		},
		saved: () => journal,
	}
}

test('35 minutes of offline work survives restart and uploads timestamps without computing totals', async () => {
	const f = fixture()
	let offline = f.restore()
	offline.start(null)
	f.advance(35)
	offline = f.restore()
	offline.stop()
	const api = { syncOffline: mock(async () => synced) }
	expect(await offline.flush(api, () => false)).toEqual(synced)
	expect(api.syncOffline).toHaveBeenCalledWith(ownerId, [
		{
			id: '00000000-0000-4000-8000-000000000001',
			startedAt: start,
			endedAt: addMinutes(start, 35),
			originSessionId: null,
		},
	])
	expect(f.restore().pending).toBe(false)
})

test('failed uploads preserve IDs and saved work for retries', async () => {
	const f = fixture()
	const offline = f.restore()
	offline.start(null)
	f.advance(35)
	offline.stop()
	const api = {
		syncOffline: mock(async () => {
			throw new ConnectionError('Unavailable')
		}),
	}
	await expect(offline.flush(api, () => false)).rejects.toThrow('Unavailable')
	expect(f.restore().pending).toBe(true)
	expect(f.saved().sessions[0]?.startedAt).toEqual(start)
	expect(offline.pendingSessions).toBe(1)
	expect(offline.lastSuccessfulSyncAt).toBeNull()
})

test('a stop during an upload is retained and sent after the running observation is acknowledged', async () => {
	const f = fixture()
	const offline = f.restore()
	offline.start(null)
	let resolve!: (state: TimerState) => void
	const api = {
		syncOffline: mock(
			() =>
				new Promise<TimerState>((done) => {
					resolve = done
				}),
		),
	}
	const upload = offline.flush(api, () => false)
	f.advance(35)
	offline.stop()
	resolve(synced)
	await Promise.resolve()
	await Promise.resolve()
	expect(api.syncOffline).toHaveBeenCalledTimes(2)
	expect(api.syncOffline.mock.calls[1]?.[1]?.[0]?.endedAt).toEqual(
		addMinutes(start, 35),
	)
	resolve(synced)
	await upload
	expect(offline.pending).toBe(false)
})

test('disposal after an API response preserves the unacknowledged journal', async () => {
	const f = fixture()
	const offline = f.restore()
	offline.start(null)
	let stopped = false
	await offline.flush(
		{
			syncOffline: async () => {
				stopped = true
				return synced
			},
		},
		() => stopped,
	)
	expect(f.restore().pending).toBe(true)
	expect(f.restore().lastSuccessfulSyncAt).toBeNull()
})

test('queue counts progress after each confirmed batch and successful sync time survives restart', async () => {
	const f = fixture()
	const offline = f.restore()
	for (let index = 0; index < 101; index++) {
		offline.start(null)
		offline.stop()
	}
	expect(offline.pendingSessions).toBe(101)
	const counts: number[] = []
	await offline.flush(
		{ syncOffline: async () => synced },
		() => false,
		() => counts.push(offline.pendingSessions),
	)
	expect(counts).toEqual([1, 0])
	expect(f.restore().pendingSessions).toBe(0)
	expect(f.restore().lastSuccessfulSyncAt).toEqual(synced.timer.asOf)
})

test('controller reports in-flight sync, preserves counts on failure, and publishes acknowledgement', async () => {
	const f = fixture()
	const offline = f.restore()
	offline.start(null)
	offline.stop()
	let reject!: (error: Error) => void
	const syncOffline = mock(
		() =>
			new Promise<TimerState>((_resolve, fail) => {
				reject = fail
			}),
	)
	const tracker = new TrackerController(
		{
			getActive: async () => null,
			getTimer: async () => synced,
			start: async () => {
				throw new Error('Unexpected start')
			},
			end: async () => {},
			watch: async () => {},
			dispose: () => {},
			syncOffline,
		},
		() => {},
		offline,
	)
	const upload = tracker.refresh()
	expect(tracker.state.syncingOffline).toBe(true)
	expect(tracker.state.pendingSessions).toBe(1)
	expect(tracker.state.lastSuccessfulSyncAt).toBeNull()
	reject(new ConnectionError('Unavailable'))
	await upload
	expect(tracker.state.syncingOffline).toBe(false)
	expect(tracker.state.pendingSessions).toBe(1)
	expect(tracker.state.lastSuccessfulSyncAt).toBeNull()
	syncOffline.mockImplementation(async () => synced)
	await tracker.refresh()
	expect(tracker.state.pendingSessions).toBe(0)
	expect(tracker.state.lastSuccessfulSyncAt).toEqual(synced.timer.asOf)
	expect(f.restore().lastSuccessfulSyncAt).toEqual(synced.timer.asOf)
})

test('storage errors never acknowledge local work or erase queued observations', () => {
	const offline = new OfflineTracker(
		{
			load: emptyOfflineJournal,
			save: () => {
				throw new Error('Disk unavailable')
			},
		},
		ownerId,
		() => ownerId,
	)
	expect(() => offline.start(null)).toThrow('Disk unavailable')
	expect(offline.pending).toBe(false)
})

test('controller allows offline start and stop, then adopts the server snapshot after syncing', async () => {
	const f = fixture()
	const offline = f.restore()
	const api = {
		getActive: async () => {
			throw new ConnectionError('Unavailable')
		},
		getTimer: async () => synced,
		start: mock(async () => {
			throw new Error('Should not be called')
		}),
		end: mock(async () => {}),
		watch: async () => {},
		dispose: () => {},
		syncOffline: mock(async () => synced),
	}
	const tracker = new TrackerController(api, () => {}, offline)
	await tracker.start()
	expect(tracker.state.status).toBe('offline')
	expect(tracker.state.activeSession).not.toBeNull()
	f.advance(35)
	await tracker.stop()
	expect(tracker.state.activeSession).toBeNull()
	expect(tracker.state.message).toContain('Waiting to sync')
	await tracker.refresh()
	expect(tracker.state.status).toBe('ready')
	expect(tracker.displayedSeconds('daily')).toBe(2100)
	expect(api.start).not.toHaveBeenCalled()
	expect(api.end).not.toHaveBeenCalled()
})

test('an old cached active session is reconciled before creating new offline work on startup', async () => {
	const f = fixture()
	const offline = f.restore()
	offline.remember({
		id: ownerId,
		type: 'work',
		startedAt: start,
		endedAt: null,
		abandonedAt: null,
	})
	const api = {
		getActive: async () => null,
		getTimer: async () => synced,
		start: async () => {
			throw new Error('Unexpected start')
		},
		end: async () => {},
		watch: async () => {},
		dispose: () => {},
		syncOffline: mock(async () => synced),
	}
	const tracker = new TrackerController(api, () => {}, f.restore())
	expect(tracker.state.status).toBe('loading')
	await tracker.refresh()
	expect(tracker.state.status).toBe('ready')
	expect(tracker.state.activeSession).toBeNull()
	expect(api.syncOffline).not.toHaveBeenCalled()
	expect(f.saved().sessions).toHaveLength(0)
})

test('reconnection synchronizes queued observations and adopts an active web session', async () => {
	const f = fixture()
	const offline = f.restore()
	offline.start(null)
	const web: SessionResponse = {
		id: ownerId,
		type: 'work',
		startedAt: addMinutes(start, 20),
		endedAt: null,
		abandonedAt: null,
	}
	const snapshot: TimerState = {
		...synced,
		activeSession: web,
		timer: { ...synced.timer, running: true },
	}
	let finish!: () => void
	let resolveSynced!: () => void
	const done = new Promise<void>((resolve) => {
		resolveSynced = resolve
	})
	const api = {
		getActive: async () => web,
		getTimer: async () => snapshot,
		start: async () => web,
		end: async () => {},
		watch: (emit: (session: SessionResponse | null) => void) => {
			emit(web)
			return new Promise<void>((resolve) => {
				finish = resolve
			})
		},
		dispose: () => finish?.(),
		syncOffline: mock(async () => snapshot),
	}
	const tracker = new TrackerController(
		api,
		(state) => {
			if (state.status === 'working' && state.activeSession?.id === web.id)
				resolveSynced()
		},
		offline,
	)
	const connection = tracker.connect({
		wait: async () => {},
		dispose: () => {},
	})
	await done
	expect(api.syncOffline).toHaveBeenCalledTimes(1)
	expect(tracker.state.activeSession?.id).toBe(web.id)
	expect(offline.pending).toBe(false)
	tracker.dispose()
	await connection
})
