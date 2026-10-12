import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	it,
	spyOn,
} from 'bun:test'
import { client, db } from '@db'
import { timeSessions } from '@db/schema'
import { API_CONFIG } from '@shared/api-config'
import { SessionStreamStateSchema } from 'contracts'
import { addMilliseconds, subHours } from 'date-fns'
import { eq, sql } from 'drizzle-orm'
import { SignJWT } from 'jose'
import postgres from 'postgres'
import { app } from '@/app'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { timeSessionsRepository } from '../repository'
import { timeTrackerService } from '../service'
import { createSessionStream } from '../session-events'
import { startSessionListener } from '../session-listener'
import {
	mutateSessions,
	SESSION_EVENTS_CHANNEL,
} from '../session-notifications'
import { buildTimerSnapshot } from '../timer-snapshot'
import {
	OTHER_USER,
	registerAndGetToken,
	seedSession,
	VALID_USER,
} from './fixtures'

const external = postgres(API_CONFIG.DATABASE_URL, { max: 1 })
const readers: ReadableStreamDefaultReader<Uint8Array>[] = []
const signals: AbortController[] = []

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
	await startSessionListener()
})

afterEach(async () => {
	for (const signal of signals.splice(0)) signal.abort()
	for (const reader of readers.splice(0)) await reader.cancel().catch(() => {})
	await cleanDatabase()
})

afterAll(async () => {
	await external.end()
})

function readerFor(response: Response) {
	const reader = response.body!.getReader()
	readers.push(reader)
	return reader
}

async function next(
	reader: ReadableStreamDefaultReader<Uint8Array>,
	timeout = 2000,
) {
	let timer: ReturnType<typeof setTimeout> | undefined
	try {
		return await Promise.race([
			reader.read(),
			new Promise<never>((_resolve, reject) => {
				timer = setTimeout(
					() => reject(new Error('Timed out waiting for SSE')),
					timeout,
				)
			}),
		])
	} finally {
		clearTimeout(timer)
	}
}

async function state(reader: ReadableStreamDefaultReader<Uint8Array>) {
	const result = await next(reader)
	const text = new TextDecoder().decode(result.value)
	expect(text).toStartWith('event: session-state\n')
	return SessionStreamStateSchema.parse(JSON.parse(text.split('data: ')[1]))
}

async function open(userId: string, lifetime = 60_000) {
	const controller = new AbortController()
	signals.push(controller)
	return readerFor(
		await createSessionStream(userId, controller.signal, Date.now() + lifetime),
	)
}

describe('session SSE', () => {
	it('refreshes computed totals at the server boundary without a session mutation', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		const activeSession = await timeTrackerService.startSession(userId, 'work')
		const before = buildTimerSnapshot(600_000, activeSession, new Date())
		const boundary = addMilliseconds(new Date(), 100)
		const after = {
			...before,
			asOf: boundary,
			dayStartedAt: boundary,
			dailyWorkSeconds: 0,
		}
		const read = spyOn(timeTrackerService, 'getTimer')
			.mockResolvedValueOnce({
				activeSession,
				timer: { ...before, nextDayAt: boundary },
			})
			.mockResolvedValue({ activeSession, timer: after })
		try {
			const reader = await open(userId)
			expect((await state(reader)).timer?.dailyWorkSeconds).toBe(600)
			const midnight = await state(reader)
			expect(midnight.timer?.dailyWorkSeconds).toBe(0)
			expect(midnight.activeSession?.id).toBe(activeSession.id)
			expect(read).toHaveBeenCalledTimes(2)
		} finally {
			read.mockRestore()
		}
	})
	it('rejects unauthenticated, invalid, expired, and non-expiring tokens', async () => {
		const secret = new TextEncoder().encode(API_CONFIG.JWT_SECRET)
		const expired = await new SignJWT({ sub: 'user' })
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime(1)
			.sign(secret)
		const noExpiry = await new SignJWT({ sub: 'user' })
			.setProtectedHeader({ alg: 'HS256' })
			.sign(secret)
		for (const token of [null, 'invalid', expired, noExpiry]) {
			const response = await app.handle(
				new Request('http://localhost/api/v1/time-tracker/events', {
					headers: token ? { Authorization: `Bearer ${token}` } : {},
				}),
			)
			expect(response.status).toBe(401)
		}
	})

	it('serves a real authenticated route with streaming headers and initial state', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		const session = await seedSession({ userId })
		const controller = new AbortController()
		signals.push(controller)
		const response = await app.handle(
			new Request('http://localhost/api/v1/time-tracker/events', {
				headers: { Authorization: `Bearer ${token}` },
				signal: controller.signal,
			}),
		)
		expect(response.status).toBe(200)
		expect(response.headers.get('Content-Type')).toContain('text/event-stream')
		expect(response.headers.get('X-Accel-Buffering')).toBe('no')
		expect(response.headers.get('Cache-Control')).toContain('no-store')
		expect((await state(readerFor(response))).activeSession?.id).toBe(
			session.id,
		)
	})

	it('pushes committed start, end, and explicit discard to the owner only', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		const { userId: otherId } = await registerAndGetToken(OTHER_USER)
		const owner = await open(userId)
		const other = await open(otherId)
		expect((await state(owner)).activeSession).toBeNull()
		expect((await state(other)).activeSession).toBeNull()
		const read = spyOn(timeTrackerService, 'getTimer')
		try {
			const started = await timeTrackerService.startSession(userId, 'work')
			expect((await state(owner)).activeSession?.id).toBe(started.id)
			await timeTrackerService.endSession(userId, started.id)
			expect((await state(owner)).activeSession).toBeNull()
			const abandoned = await timeTrackerService.startSession(userId, 'work')
			await state(owner)
			await timeTrackerService.abandonSession(userId, abandoned.id)
			expect((await state(owner)).activeSession).toBeNull()
			const stale = await timeSessionsRepository.create(
				userId,
				'work',
				subHours(new Date(), 3),
			)
			expect((await state(owner)).activeSession?.id).toBe(stale?.id)
			await timeTrackerService.abandonSession(userId, stale!.id)
			expect((await state(owner)).activeSession).toBeNull()
			expect(read.mock.calls.some(([id]) => id === otherId)).toBe(false)
		} finally {
			read.mockRestore()
		}
	})

	it('keeps a change arriving during initial snapshot acquisition pending', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		let finishRead!: (
			value: Awaited<ReturnType<typeof timeTrackerService.getTimer>>,
		) => void
		let readStarted!: () => void
		const startedRead = new Promise<void>((resolve) => {
			readStarted = resolve
		})
		const read = spyOn(timeTrackerService, 'getTimer').mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					finishRead = resolve
					readStarted()
				}),
		)
		try {
			const reader = await open(userId)
			await startedRead
			// Resolve the initial read only after this process has received NOTIFY.
			let notified!: () => void
			const notification = new Promise<void>((resolve) => {
				notified = resolve
			})
			const listener = await client.listen(SESSION_EVENTS_CHANNEL, notified)
			const session = await timeSessionsRepository.create(
				userId,
				'work',
				new Date(),
			)
			await notification
			finishRead({
				activeSession: null,
				timer: buildTimerSnapshot(0, null, new Date()),
			})
			expect((await state(reader)).activeSession).toBeNull()
			expect((await state(reader)).activeSession?.id).toBe(session?.id)
			await listener.unlisten()
		} finally {
			read.mockRestore()
		}
	})

	it('receives notifications from another database client and snapshots on reconnect', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		const reader = await open(userId)
		await state(reader)
		const session = await seedSession({ userId })
		await external.notify(SESSION_EVENTS_CHANNEL, userId)
		expect((await state(reader)).activeSession?.id).toBe(session.id)
		await reader.cancel()
		await timeTrackerService.endSession(userId, session.id)
		expect((await state(await open(userId))).activeSession).toBeNull()
	})

	it('does not publish a rolled-back mutation or a no-op', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		const notifications: string[] = []
		const listener = await external.listen(SESSION_EVENTS_CHANNEL, (id) =>
			notifications.push(id),
		)
		try {
			await expect(
				mutateSessions(userId, async (transaction) => {
					await transaction
						.insert(timeSessions)
						.values({ userId, type: 'work', startedAt: new Date() })
					await transaction.execute(
						sql`select pg_notify(${SESSION_EVENTS_CHANNEL}, ${userId})`,
					)
					throw new Error('rollback')
				}),
			).rejects.toThrow('rollback')
			await timeTrackerService.endSession(
				userId,
				'00000000-0000-0000-0000-000000000000',
			)
			await new Promise((resolve) => setTimeout(resolve, 50))
			expect(notifications).toEqual([])
			expect(
				await db
					.select()
					.from(timeSessions)
					.where(eq(timeSessions.userId, userId)),
			).toEqual([])
		} finally {
			await listener.unlisten()
		}
	})

	it('reconciles connected subscribers after the database listener reconnects', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		const reader = await open(userId)
		expect((await state(reader)).activeSession).toBeNull()
		// A direct seed deliberately produces no NOTIFY, representing a missed event.
		const session = await seedSession({ userId })
		const listener = await startSessionListener()
		await external`select pg_terminate_backend(${listener.state.pid})`
		expect((await state(reader)).activeSession?.id).toBe(session.id)
	})

	it('closes at token expiry and releases subscriptions on cancellation', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		const read = spyOn(timeTrackerService, 'getTimer')
		try {
			const reader = await open(userId, 100)
			await state(reader)
			expect((await next(reader)).done).toBe(true)
			const cancelled = await open(userId)
			await state(cancelled)
			await cancelled.cancel()
			read.mockClear()
			await external.notify(SESSION_EVENTS_CHANNEL, userId)
			await new Promise((resolve) => setTimeout(resolve, 50))
			expect(read).not.toHaveBeenCalled()
		} finally {
			read.mockRestore()
		}
	})

	it('sends idle heartbeats without querying the database', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		const reader = await open(userId)
		await state(reader)
		const read = spyOn(timeTrackerService, 'getTimer')
		try {
			const heartbeat = await next(reader, 25_000)
			expect(new TextDecoder().decode(heartbeat.value)).toBe(': heartbeat\n\n')
			expect(read).not.toHaveBeenCalled()
		} finally {
			read.mockRestore()
		}
	}, 30_000)
})
