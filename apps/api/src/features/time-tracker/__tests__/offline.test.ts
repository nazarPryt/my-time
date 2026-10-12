import { afterEach, beforeAll, expect, test } from 'bun:test'
import { db } from '@db'
import { timeSessions } from '@db/schema'
import { SyncOfflineSessionsRequestSchema, TimerStateSchema } from 'contracts'
import { addMinutes, startOfDay, subMinutes } from 'date-fns'
import { eq } from 'drizzle-orm'
import { app } from '@/app'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { groupCompletedWorkByDay } from '../helpers'
import { OfflineSyncError, syncOfflineSessions } from '../offline-sync'
import { timeSessionsRepository } from '../repository'
import { buildTodaySummary } from '../today-summary'
import {
	OTHER_USER,
	registerAndGetToken,
	seedSession,
	VALID_USER,
} from './fixtures'

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})
afterEach(cleanDatabase)

test('overlapping desktop and web observations count once across timer, today, and weekly totals', async () => {
	const { userId } = await registerAndGetToken(VALID_USER)
	const start = startOfDay(new Date())
	await seedSession({
		userId,
		startedAt: addMinutes(start, 20),
		endedAt: addMinutes(start, 50),
	})
	const observation = {
		id: crypto.randomUUID(),
		startedAt: start,
		endedAt: addMinutes(start, 35),
		originSessionId: null,
	}
	await Promise.all([
		syncOfflineSessions(
			userId,
			{ ownerId: userId, sessions: [observation] },
			addMinutes(start, 60),
		),
		syncOfflineSessions(
			userId,
			{ ownerId: userId, sessions: [observation] },
			addMinutes(start, 60),
		),
	])
	const rows = await db
		.select()
		.from(timeSessions)
		.where(eq(timeSessions.userId, userId))
	expect(rows).toHaveLength(2)
	expect(
		(
			await timeSessionsRepository.getTimer(
				userId,
				start,
				addMinutes(start, 60),
			)
		).milliseconds,
	).toBe(50 * 60_000)
	const today = buildTodaySummary(rows, addMinutes(start, 60))
	expect(today.totalWorkSeconds).toBe(50 * 60)
	expect(today.timer?.dailyWorkSeconds).toBe(50 * 60)
	expect([...groupCompletedWorkByDay(rows).values()][0]?.totalWorkSeconds).toBe(
		50 * 60,
	)
})

test('an offline stop closes its original session without stopping a newer web session', async () => {
	const { userId } = await registerAndGetToken(VALID_USER)
	const now = new Date()
	const original = await seedSession({
		userId,
		startedAt: subMinutes(now, 50),
		endedAt: subMinutes(now, 30),
	})
	const web = await seedSession({ userId, startedAt: subMinutes(now, 20) })
	await syncOfflineSessions(
		userId,
		{
			ownerId: userId,
			sessions: [
				{
					id: crypto.randomUUID(),
					startedAt: subMinutes(now, 40),
					endedAt: subMinutes(now, 10),
					originSessionId: original.id,
				},
			],
		},
		now,
	)
	expect((await timeSessionsRepository.getActive(userId))?.id).toBe(web.id)
	const [row] = await db
		.select()
		.from(timeSessions)
		.where(eq(timeSessions.id, original.id))
	expect(row?.endedAt).toEqual(original.endedAt)
})

test('an offline stop ends a still-open original at the observed time', async () => {
	const { userId } = await registerAndGetToken(VALID_USER)
	const now = new Date()
	const original = await seedSession({ userId, startedAt: subMinutes(now, 50) })
	await syncOfflineSessions(
		userId,
		{
			ownerId: userId,
			sessions: [
				{
					id: crypto.randomUUID(),
					startedAt: subMinutes(now, 40),
					endedAt: subMinutes(now, 10),
					originSessionId: original.id,
				},
			],
		},
		now,
	)
	expect(await timeSessionsRepository.getActive(userId)).toBeNull()
	const [row] = await db
		.select()
		.from(timeSessions)
		.where(eq(timeSessions.id, original.id))
	expect(row?.endedAt).toEqual(subMinutes(now, 10))
})

test('running offline work adopts the active web session and lost-response retries do not duplicate work', async () => {
	const { userId } = await registerAndGetToken(VALID_USER)
	const now = new Date()
	const web = await seedSession({ userId, startedAt: subMinutes(now, 20) })
	const observation = {
		id: crypto.randomUUID(),
		startedAt: subMinutes(now, 35),
		endedAt: null,
		originSessionId: null,
	}
	await syncOfflineSessions(
		userId,
		{ ownerId: userId, sessions: [observation] },
		now,
	)
	await syncOfflineSessions(
		userId,
		{ ownerId: userId, sessions: [observation] },
		addMinutes(now, 1),
	)
	expect((await timeSessionsRepository.getActive(userId))?.id).toBe(web.id)
	const rows = await db
		.select()
		.from(timeSessions)
		.where(eq(timeSessions.userId, userId))
	expect(rows).toHaveLength(2)
	expect(rows.find((row) => row.id === observation.id)?.endedAt).toEqual(
		addMinutes(now, 1),
	)
})

test('running offline work becomes the active session when no web session exists, then a queued stop is retry safe', async () => {
	const { userId } = await registerAndGetToken(VALID_USER)
	const now = new Date()
	const observation = {
		id: crypto.randomUUID(),
		startedAt: subMinutes(now, 35),
		endedAt: null,
		originSessionId: null,
	}
	await syncOfflineSessions(
		userId,
		{ ownerId: userId, sessions: [observation] },
		now,
	)
	expect((await timeSessionsRepository.getActive(userId))?.id).toBe(
		observation.id,
	)
	const stopped = { ...observation, endedAt: now }
	await syncOfflineSessions(
		userId,
		{ ownerId: userId, sessions: [stopped] },
		addMinutes(now, 1),
	)
	await syncOfflineSessions(
		userId,
		{ ownerId: userId, sessions: [stopped] },
		addMinutes(now, 2),
	)
	expect(await timeSessionsRepository.getActive(userId)).toBeNull()
	expect(
		await db.select().from(timeSessions).where(eq(timeSessions.userId, userId)),
	).toHaveLength(1)
})

test('sync route authenticates, rejects wrong owners and invalid intervals, and returns a server timer', async () => {
	const { userId, token } = await registerAndGetToken(VALID_USER)
	const { userId: otherId } = await registerAndGetToken(OTHER_USER)
	const now = new Date()
	const observation = {
		id: crypto.randomUUID(),
		startedAt: subMinutes(now, 35),
		endedAt: now,
		originSessionId: null,
	}
	const send = (ownerId: string, bearer?: string) =>
		app.handle(
			new Request('http://localhost/api/v1/time-tracker/offline/sync', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
				},
				body: JSON.stringify({ ownerId, sessions: [observation] }),
			}),
		)
	expect((await send(userId)).status).toBe(401)
	expect((await send(otherId, token)).status).toBe(409)
	const response = await send(userId, token)
	expect(response.status).toBe(200)
	expect(TimerStateSchema.parse(await response.json()).timer.running).toBe(
		false,
	)
	expect(
		SyncOfflineSessionsRequestSchema.safeParse({
			ownerId: userId,
			sessions: [{ ...observation, endedAt: subMinutes(now, 40) }],
		}).success,
	).toBe(false)
	await expect(
		syncOfflineSessions(
			userId,
			{
				ownerId: userId,
				sessions: [
					{
						...observation,
						id: crypto.randomUUID(),
						startedAt: addMinutes(now, 10),
						endedAt: null,
					},
				],
			},
			now,
		),
	).rejects.toBeInstanceOf(OfflineSyncError)
})
