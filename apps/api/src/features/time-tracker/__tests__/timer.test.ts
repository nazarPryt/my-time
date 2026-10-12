import { afterEach, beforeAll, expect, test } from 'bun:test'
import { TimerStateSchema } from 'contracts'
import { addDays, addMinutes, startOfDay, subDays, subMinutes } from 'date-fns'
import { app } from '@/app'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { timeSessionsRepository } from '../repository'
import { timeTrackerService } from '../service'
import { registerAndGetToken, seedSession, VALID_USER } from './fixtures'

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})
afterEach(cleanDatabase)

test('aggregate includes completed and active work, excluding discarded and previous-day work', async () => {
	const { userId } = await registerAndGetToken(VALID_USER)
	const start = startOfDay(new Date())
	const now = addMinutes(start, 30)
	await seedSession({
		userId,
		startedAt: subMinutes(start, 10),
		endedAt: addMinutes(start, 5),
	})
	await seedSession({
		userId,
		startedAt: addMinutes(start, 10),
		endedAt: addMinutes(start, 15),
	})
	await seedSession({
		userId,
		startedAt: addMinutes(start, 16),
		abandonedAt: addMinutes(start, 18),
	})
	await seedSession({
		userId,
		startedAt: subDays(start, 2),
		endedAt: subDays(start, 1),
	})
	const active = await seedSession({ userId, startedAt: addMinutes(start, 20) })
	const result = await timeSessionsRepository.getTimer(userId, start, now)
	expect(result.milliseconds).toBe(20 * 60 * 1000)
	expect(result.active?.id).toBe(active.id)
})

test('today and weekly queries retain the correct portions of sessions spanning days', async () => {
	const { userId } = await registerAndGetToken(VALID_USER)
	const start = startOfDay(new Date())
	const crossing = await seedSession({
		userId,
		startedAt: subMinutes(start, 10),
		endedAt: addMinutes(start, 5),
	})
	const sessions = await timeSessionsRepository.getTodaySessions(
		userId,
		start,
		addDays(start, 1),
	)
	expect(sessions.map((session) => session.id)).toContain(crossing.id)
	const previous = await timeSessionsRepository.getTimer(
		userId,
		subDays(start, 1),
		start,
	)
	const today = await timeSessionsRepository.getTimer(
		userId,
		start,
		addMinutes(start, 5),
	)
	expect(previous.milliseconds).toBe(600_000)
	expect(today.milliseconds).toBe(300_000)
})

test('timer route authenticates and returns backend totals with server day boundaries', async () => {
	const { token, userId } = await registerAndGetToken(VALID_USER)
	const active = await seedSession({
		userId,
		startedAt: subMinutes(new Date(), 5),
	})
	const response = await app.handle(
		new Request('http://localhost/api/v1/time-tracker/timer', {
			headers: { authorization: `Bearer ${token}` },
		}),
	)
	expect(response.status).toBe(200)
	const state = TimerStateSchema.parse(await response.json())
	expect(state.activeSession?.id).toBe(active.id)
	expect(state.timer.sessionWorkSeconds).toBeGreaterThanOrEqual(300)
	expect(state.timer.dayStartedAt).toEqual(startOfDay(state.timer.asOf))
	expect(state.timer.nextDayAt).toEqual(addDays(state.timer.dayStartedAt, 1))
	const unauthorized = await app.handle(
		new Request('http://localhost/api/v1/time-tracker/timer'),
	)
	expect(unauthorized.status).toBe(401)
})

test('a completed total survives Stop and another session adds to it', async () => {
	const { userId } = await registerAndGetToken(VALID_USER)
	const now = new Date()
	await seedSession({
		userId,
		startedAt: subMinutes(now, 10),
		endedAt: subMinutes(now, 5),
	})
	const stopped = await timeTrackerService.getTimer(userId)
	expect(stopped.timer.running).toBe(false)
	const active = await timeTrackerService.startSession(userId, 'work')
	const running = await timeTrackerService.getTimer(userId)
	expect(running.activeSession?.id).toBe(active.id)
	expect(running.timer.dailyWorkSeconds).toBeGreaterThanOrEqual(
		stopped.timer.dailyWorkSeconds,
	)
})
