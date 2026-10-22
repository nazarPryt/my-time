import { afterEach, expect, spyOn, test } from 'bun:test'
import type { SessionResponse } from 'contracts'
import * as trackerApi from '../api/api'
import { useTimeTrackerStore } from './store'

const session: SessionResponse = {
	id: 'session-1',
	type: 'work',
	startedAt: new Date('2026-10-11T08:00:00Z'),
	endedAt: null,
	abandonedAt: null,
}
const spies: { mockRestore(): void }[] = []
afterEach(() => {
	useTimeTrackerStore.getState().endSync()
	for (const spy of spies.splice(0)) spy.mockRestore()
})

test('SSE owns summary refreshes when a start response arrives before or after its event', async () => {
	const store = useTimeTrackerStore.getState
	const summary = spyOn(trackerApi, 'fetchTodaySummary')
	const start = spyOn(trackerApi, 'startSession').mockResolvedValue({
		data: session,
		error: null,
	} as Awaited<ReturnType<typeof trackerApi.startSession>>)
	spies.push(summary, start)
	store().beginSync(new AbortController().signal)
	store().applySnapshot(null)
	await store().startWork()
	expect(summary).not.toHaveBeenCalled()
	store().applySnapshot(session)
	store().applySnapshot(null)
	start.mockImplementationOnce(async () => {
		store().applySnapshot(session)
		return { data: session, error: null } as Awaited<
			ReturnType<typeof trackerApi.startSession>
		>
	})
	await store().startWork()
	expect(summary).not.toHaveBeenCalled()
	expect(store().activeSession).toEqual(session)
})

test('a successful command refreshes statistics when the stream is disconnected', async () => {
	const store = useTimeTrackerStore.getState
	const summary = spyOn(trackerApi, 'fetchTodaySummary').mockResolvedValue({
		data: null,
		error: null,
	} as Awaited<ReturnType<typeof trackerApi.fetchTodaySummary>>)
	const end = spyOn(trackerApi, 'endSession').mockResolvedValue({
		data: session,
		error: null,
	} as Awaited<ReturnType<typeof trackerApi.endSession>>)
	const active = spyOn(trackerApi, 'fetchActiveSession').mockResolvedValue(
		session,
	)
	spies.push(summary, end, active)
	store().beginSync(new AbortController().signal)
	store().applySnapshot(session)
	store().disconnectStream()
	await store().stopWork()
	expect(summary).toHaveBeenCalledTimes(1)
	expect(store().activeSession).toBeNull()
})

test('connected stop uses pushed state and preserves a newer pushed session', async () => {
	const store = useTimeTrackerStore.getState
	const active = spyOn(trackerApi, 'fetchActiveSession')
	const summary = spyOn(trackerApi, 'fetchTodaySummary')
	const newer = { ...session, id: 'session-2' }
	const end = spyOn(trackerApi, 'endSession').mockImplementationOnce(
		async () => {
			store().applySnapshot(newer)
			return { data: session, error: null } as Awaited<
				ReturnType<typeof trackerApi.endSession>
			>
		},
	)
	spies.push(active, summary, end)
	store().beginSync(new AbortController().signal)
	store().applySnapshot(session)
	await store().stopWork()
	expect(end).toHaveBeenCalledWith(session.id)
	expect(active).not.toHaveBeenCalled()
	expect(summary).not.toHaveBeenCalled()
	expect(store().activeSession).toEqual(newer)
})

test('disconnected stop checks the server session instead of a stale local session', async () => {
	const store = useTimeTrackerStore.getState
	const newer = { ...session, id: 'session-2' }
	const active = spyOn(trackerApi, 'fetchActiveSession').mockResolvedValue(
		newer,
	)
	const summary = spyOn(trackerApi, 'fetchTodaySummary').mockResolvedValue({
		data: null,
		error: null,
	} as Awaited<ReturnType<typeof trackerApi.fetchTodaySummary>>)
	const end = spyOn(trackerApi, 'endSession').mockResolvedValue({
		data: newer,
		error: null,
	} as Awaited<ReturnType<typeof trackerApi.endSession>>)
	spies.push(active, summary, end)
	store().beginSync(new AbortController().signal)
	store().applySnapshot(session)
	store().disconnectStream()
	await store().stopWork()
	expect(active).toHaveBeenCalledTimes(1)
	expect(end).toHaveBeenCalledWith(newer.id)
})

test('a successful Stop still confirms idle if the event stream disconnects during it', async () => {
	const store = useTimeTrackerStore.getState
	const summary = spyOn(trackerApi, 'fetchTodaySummary').mockResolvedValue({
		data: null,
		error: null,
	} as Awaited<ReturnType<typeof trackerApi.fetchTodaySummary>>)
	const end = spyOn(trackerApi, 'endSession').mockImplementationOnce(
		async () => {
			store().disconnectStream()
			return { data: session, error: null } as Awaited<
				ReturnType<typeof trackerApi.endSession>
			>
		},
	)
	spies.push(summary, end)
	store().beginSync(new AbortController().signal)
	store().applySnapshot(session)
	await store().stopWork()
	expect(store().activeSession).toBeNull()
	expect(summary).toHaveBeenCalledTimes(1)
})

test('an abandoned old summary queue cannot overwrite or delay a new mount', async () => {
	const store = useTimeTrackerStore.getState
	const summaryData = {
		sessions: [],
		totalWorkSeconds: 120,
		sessionsCompleted: 1,
		longestSessionSeconds: 120,
	}
	let resolve!: (
		result: Awaited<ReturnType<typeof trackerApi.fetchTodaySummary>>,
	) => void
	const summary = spyOn(trackerApi, 'fetchTodaySummary')
		.mockImplementationOnce(
			() =>
				new Promise((done) => {
					resolve = done
				}),
		)
		.mockResolvedValue({ data: summaryData, error: null } as Awaited<
			ReturnType<typeof trackerApi.fetchTodaySummary>
		>)
	spies.push(summary)
	const old = new AbortController()
	store().beginSync(old.signal)
	const pending = store().refreshSummary()
	old.abort()
	store().endSync()
	store().beginSync(new AbortController().signal)
	await store().refreshSummary()
	expect(store().todaySummary).toEqual(summaryData)
	resolve({
		data: { ...summaryData, totalWorkSeconds: 999 },
		error: null,
	} as Awaited<ReturnType<typeof trackerApi.fetchTodaySummary>>)
	await pending
	expect(store().todaySummary).toEqual(summaryData)
})

test('a newer snapshot invalidates an in-flight summary and queues one fresh read', async () => {
	const store = useTimeTrackerStore.getState
	const summaryData = {
		sessions: [],
		totalWorkSeconds: 120,
		sessionsCompleted: 1,
		longestSessionSeconds: 120,
	}
	let resolve!: (
		result: Awaited<ReturnType<typeof trackerApi.fetchTodaySummary>>,
	) => void
	const summary = spyOn(trackerApi, 'fetchTodaySummary')
		.mockImplementationOnce(
			() =>
				new Promise((done) => {
					resolve = done
				}),
		)
		.mockResolvedValue({ data: summaryData, error: null } as Awaited<
			ReturnType<typeof trackerApi.fetchTodaySummary>
		>)
	spies.push(summary)
	store().beginSync(new AbortController().signal)
	const pending = store().refreshSummary()
	store().applySnapshot(session)
	const newer = store().refreshSummary()
	resolve({
		data: { ...summaryData, totalWorkSeconds: 999 },
		error: null,
	} as Awaited<ReturnType<typeof trackerApi.fetchTodaySummary>>)
	await Promise.all([pending, newer])
	expect(summary).toHaveBeenCalledTimes(2)
	expect(store().todaySummary).toEqual(summaryData)
})

test('ending a mount while checking server state prevents a delayed command', async () => {
	const store = useTimeTrackerStore.getState
	let resolve!: (session: SessionResponse | null) => void
	const active = spyOn(trackerApi, 'fetchActiveSession').mockImplementationOnce(
		() =>
			new Promise((done) => {
				resolve = done
			}),
	)
	const start = spyOn(trackerApi, 'startSession')
	spies.push(active, start)
	store().beginSync(new AbortController().signal)
	const pending = store().startWork()
	store().endSync()
	resolve(null)
	await pending
	expect(start).not.toHaveBeenCalled()
})

test('desktop status becomes unknown on disconnect and is reset for a new owner', () => {
	const store = useTimeTrackerStore.getState
	store().beginSync(new AbortController().signal)
	expect(store().desktopStatus).toBe('checking')
	store().applyDesktopPresence(true)
	expect(store().desktopStatus).toBe('connected')
	store().disconnectStream()
	expect(store().desktopStatus).toBe('unknown')
	store().applyDesktopPresence(false)
	expect(store().desktopStatus).toBe('disconnected')
	store().beginSync(new AbortController().signal)
	expect(store().desktopStatus).toBe('checking')
})

test('backend daily totals include active work and are cleared when the owner ends', () => {
	const store = useTimeTrackerStore.getState
	store().beginSync(new AbortController().signal)
	store().applySnapshot(session, {
		asOf: new Date('2026-10-12T10:00:00Z'),
		dayStartedAt: new Date('2026-10-12T00:00:00Z'),
		nextDayAt: new Date('2026-10-13T00:00:00Z'),
		timeZone: 'UTC',
		dailyWorkSeconds: 900,
		sessionWorkSeconds: 300,
		running: true,
	})
	expect(store().dailySeconds).toBe(900)
	expect(store().elapsed).toBe(300)
	store().endSync()
	expect(store().dailySeconds).toBeNull()
	expect(store().activeSession).toBeNull()
})
