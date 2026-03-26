import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { db } from '@db'
import { timeSessions } from '@db/schema'
import { treaty } from '@elysiajs/eden'
import type { RegisterRequest } from 'contracts'
import {
	AuthResponseSchema,
	SessionResponseSchema,
	TodaySummaryResponseSchema,
	WeeklySummaryResponseSchema,
} from 'contracts'
import { subDays, subHours, subMinutes } from 'date-fns'
import { app } from '@/app'
import { cleanDatabase, runMigrations } from '@/test/setup'

// ---------------------------------------------------------------------------
// Eden Treaty client
// ---------------------------------------------------------------------------

const api = treaty(app).api.v1

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_USER: RegisterRequest = {
	email: 'tracker@example.com',
	name: 'Tracker User',
	password: 'password123',
}

const OTHER_USER: RegisterRequest = {
	email: 'other@example.com',
	name: 'Other User',
	password: 'password123',
}

async function registerAndGetToken(user: RegisterRequest) {
	const { data } = await api.auth.register.post(user)
	const auth = AuthResponseSchema.parse(data)
	return {
		token: auth.tokens.accessToken,
		userId: auth.user.id,
	}
}

function authHeaders(token: string) {
	return { authorization: `Bearer ${token}` }
}

/** Insert a completed work session directly into the DB for a given user */
async function seedCompletedSession(
	userId: string,
	startedAt: Date,
	endedAt: Date,
) {
	const [session] = await db
		.insert(timeSessions)
		.values({ userId, type: 'work', startedAt, endedAt })
		.returning()
	return session
}

/** Insert an active (open) session directly into the DB */
async function seedActiveSession(userId: string, startedAt: Date) {
	const [session] = await db
		.insert(timeSessions)
		.values({ userId, type: 'work', startedAt })
		.returning()
	return session
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})

afterEach(async () => {
	await cleanDatabase()
})

// ---------------------------------------------------------------------------
// GET /time-tracker/active
// ---------------------------------------------------------------------------

describe('GET /time-tracker/active', () => {
	it('returns null when no active session exists', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api['time-tracker'].active.get({
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		expect(data).toBeFalsy()
	})

	it('returns the active session when one exists', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		const startedAt = subMinutes(new Date(), 5)
		await seedActiveSession(userId, startedAt)

		const { data, status } = await api['time-tracker'].active.get({
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const session = SessionResponseSchema.parse(data)
		expect(session.id).toBeTruthy()
		expect(session.type).toBe('work')
		expect(session.endedAt).toBeNull()
		expect(session.abandonedAt).toBeNull()
	})

	it("does not return another user's active session", async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
		await seedActiveSession(otherUserId, subMinutes(new Date(), 5))

		const { data, status } = await api['time-tracker'].active.get({
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		expect(data).toBeFalsy()
	})

	it('returns 401 with no token', async () => {
		const { status } = await api['time-tracker'].active.get({})
		expect(status).toBe(401)
	})

	it('returns 401 with an invalid token', async () => {
		const { status } = await api['time-tracker'].active.get({
			headers: { authorization: 'Bearer not.a.valid.token' },
		})
		expect(status).toBe(401)
	})
})

// ---------------------------------------------------------------------------
// GET /time-tracker/today
// ---------------------------------------------------------------------------

describe('GET /time-tracker/today', () => {
	it('returns empty summary when there are no sessions today', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api['time-tracker'].today.get({
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const summary = TodaySummaryResponseSchema.parse(data)
		expect(summary.sessions).toHaveLength(0)
		expect(summary.totalWorkSeconds).toBe(0)
		expect(summary.sessionsCompleted).toBe(0)
		expect(summary.longestSessionSeconds).toBe(0)
	})

	it('returns correct stats for completed work sessions today', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		const now = new Date()

		// Two completed work sessions: 30 min + 40 min
		const start1 = subMinutes(now, 90)
		const end1 = subMinutes(now, 60)
		const start2 = subMinutes(now, 50)
		const end2 = subMinutes(now, 10)

		await seedCompletedSession(userId, start1, end1)
		await seedCompletedSession(userId, start2, end2)

		const { data, status } = await api['time-tracker'].today.get({
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const summary = TodaySummaryResponseSchema.parse(data)
		expect(summary.sessions).toHaveLength(2)
		expect(summary.sessionsCompleted).toBe(2)
		// 30 min + 40 min = 70 min = 4200 seconds (allow ±2 s for timing noise)
		expect(summary.totalWorkSeconds).toBeGreaterThanOrEqual(4198)
		expect(summary.totalWorkSeconds).toBeLessThanOrEqual(4202)
		// Longest is the 40-min session
		expect(summary.longestSessionSeconds).toBeGreaterThanOrEqual(2398)
		expect(summary.longestSessionSeconds).toBeLessThanOrEqual(2402)
	})

	it('does not count abandoned sessions in stats', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		const now = new Date()

		await db.insert(timeSessions).values({
			userId,
			type: 'work',
			startedAt: subMinutes(now, 60),
			abandonedAt: subMinutes(now, 30),
		})

		const { data, status } = await api['time-tracker'].today.get({
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const summary = TodaySummaryResponseSchema.parse(data)
		// The session still appears in the list but is not counted in stats
		expect(summary.sessions).toHaveLength(1)
		expect(summary.sessionsCompleted).toBe(0)
		expect(summary.totalWorkSeconds).toBe(0)
	})

	it('does not count open (active) sessions in stats', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		await seedActiveSession(userId, subMinutes(new Date(), 20))

		const { data, status } = await api['time-tracker'].today.get({
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const summary = TodaySummaryResponseSchema.parse(data)
		expect(summary.sessions).toHaveLength(1)
		expect(summary.sessionsCompleted).toBe(0)
		expect(summary.totalWorkSeconds).toBe(0)
	})

	it('does not include sessions from other users', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
		const now = new Date()
		await seedCompletedSession(
			otherUserId,
			subMinutes(now, 60),
			subMinutes(now, 30),
		)

		const { data, status } = await api['time-tracker'].today.get({
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const summary = TodaySummaryResponseSchema.parse(data)
		expect(summary.sessions).toHaveLength(0)
	})

	it('returns 401 with no token', async () => {
		const { status } = await api['time-tracker'].today.get({})
		expect(status).toBe(401)
	})
})

// ---------------------------------------------------------------------------
// GET /time-tracker/weekly
// ---------------------------------------------------------------------------

describe('GET /time-tracker/weekly', () => {
	it('returns 30 days of data with all zeroes when no sessions exist', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api['time-tracker'].weekly.get({
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const summary = WeeklySummaryResponseSchema.parse(data)
		expect(summary.days).toHaveLength(30)
		expect(summary.currentStreakDays).toBe(0)
		for (const day of summary.days) {
			expect(day.totalWorkSeconds).toBe(0)
			expect(day.sessionsCompleted).toBe(0)
			expect(day.date).toBeInstanceOf(Date)
		}
	})

	it('days array is ordered most-recent first', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data } = await api['time-tracker'].weekly.get({
			headers: authHeaders(token),
		})
		const summary = WeeklySummaryResponseSchema.parse(data)
		// First entry should be today, last entry should be 29 days ago
		const first = summary.days[0].date
		const last = summary.days[29].date
		expect(first.getTime()).toBeGreaterThan(last.getTime())
	})

	it('reflects completed sessions for the correct day', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		const now = new Date()
		// Two completed sessions today
		await seedCompletedSession(userId, subMinutes(now, 90), subMinutes(now, 60))
		await seedCompletedSession(userId, subMinutes(now, 50), subMinutes(now, 10))

		const { data, status } = await api['time-tracker'].weekly.get({
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const summary = WeeklySummaryResponseSchema.parse(data)
		const today = summary.days[0]
		expect(today.sessionsCompleted).toBe(2)
		expect(today.totalWorkSeconds).toBeGreaterThan(0)
	})

	it('streak is 0 when today has no completed sessions', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		// Session from yesterday only
		const yesterday = subDays(new Date(), 1)
		await seedCompletedSession(
			userId,
			subMinutes(yesterday, 30),
			subMinutes(yesterday, 10),
		)

		const { data } = await api['time-tracker'].weekly.get({
			headers: authHeaders(token),
		})
		const summary = WeeklySummaryResponseSchema.parse(data)
		expect(summary.currentStreakDays).toBe(0)
	})

	it('streak counts consecutive days including today', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		const now = new Date()

		// Sessions on today, yesterday, and 2 days ago — break on 3 days ago
		for (let i = 0; i < 3; i++) {
			const base = subDays(now, i)
			await seedCompletedSession(
				userId,
				subMinutes(base, 60),
				subMinutes(base, 30),
			)
		}

		const { data } = await api['time-tracker'].weekly.get({
			headers: authHeaders(token),
		})
		const summary = WeeklySummaryResponseSchema.parse(data)
		expect(summary.currentStreakDays).toBe(3)
	})

	it('does not include abandoned sessions in day totals', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		const now = new Date()
		await db.insert(timeSessions).values({
			userId,
			type: 'work',
			startedAt: subMinutes(now, 60),
			abandonedAt: subMinutes(now, 30),
		})

		const { data } = await api['time-tracker'].weekly.get({
			headers: authHeaders(token),
		})
		const summary = WeeklySummaryResponseSchema.parse(data)
		expect(summary.days[0].sessionsCompleted).toBe(0)
		expect(summary.currentStreakDays).toBe(0)
	})

	it('returns 401 with no token', async () => {
		const { status } = await api['time-tracker'].weekly.get({})
		expect(status).toBe(401)
	})
})

// ---------------------------------------------------------------------------
// POST /time-tracker/start
// ---------------------------------------------------------------------------

describe('POST /time-tracker/start', () => {
	it('creates a new work session and returns it', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api['time-tracker'].start.post(
			{ type: 'work' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(200)
		const session = SessionResponseSchema.parse(data)
		expect(session.id).toBeTruthy()
		expect(session.type).toBe('work')
		expect(session.endedAt).toBeNull()
		expect(session.abandonedAt).toBeNull()
		expect(session.startedAt.getTime()).toBeLessThanOrEqual(Date.now())
	})

	it('abandons a stale session (>2 h old) when starting a new one', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		// Seed an old open session (3 hours ago — past the 2-hour threshold)
		const staleStart = subHours(new Date(), 3)
		const staleSession = await seedActiveSession(userId, staleStart)

		// Start a new session — should abandon the stale one
		const { status } = await api['time-tracker'].start.post(
			{ type: 'work' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(200)

		// The new session is active; the stale one is no longer active
		const { data: activeData } = await api['time-tracker'].active.get({
			headers: authHeaders(token),
		})
		const activeSession = SessionResponseSchema.parse(activeData)
		expect(activeSession.id).not.toBe(staleSession.id)

		// If the stale session is in today's list it should be abandoned
		const { data: todayData } = await api['time-tracker'].today.get({
			headers: authHeaders(token),
		})
		const summary = TodaySummaryResponseSchema.parse(todayData)
		const stale = summary.sessions.find((s) => s.id === staleSession.id)
		if (stale) {
			expect(stale.abandonedAt).not.toBeNull()
		}
	})

	it('does NOT abandon a fresh session (<2 h old) when starting another', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		// Seed a fresh open session (1 hour ago — within threshold)
		const freshStart = subHours(new Date(), 1)
		const freshSession = await seedActiveSession(userId, freshStart)

		// Start a new session
		await api['time-tracker'].start.post(
			{ type: 'work' },
			{ headers: authHeaders(token) },
		)

		// The fresh session should still be active (not abandoned)
		const { data: todayData } = await api['time-tracker'].today.get({
			headers: authHeaders(token),
		})
		const summary = TodaySummaryResponseSchema.parse(todayData)
		const fresh = summary.sessions.find((s) => s.id === freshSession.id)
		if (fresh) {
			expect(fresh.abandonedAt).toBeNull()
		}
	})

	it('returns 422 for an invalid session type', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api['time-tracker'].start.post(
			// @ts-expect-error — intentional invalid type
			{ type: 'break' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(422)
	})

	it('returns 422 when body is missing', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api['time-tracker'].start.post(
			// @ts-expect-error — intentional missing body
			{},
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(422)
	})

	it('returns 401 with no token', async () => {
		const { status } = await api['time-tracker'].start.post({ type: 'work' })
		expect(status).toBe(401)
	})
})

// ---------------------------------------------------------------------------
// PATCH /time-tracker/:id/end
// ---------------------------------------------------------------------------

describe('PATCH /time-tracker/:id/end', () => {
	it('ends an active session and returns the updated session', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		const session = await seedActiveSession(userId, subMinutes(new Date(), 30))

		const { data, status } = await api['time-tracker']({
			id: session.id,
		}).end.patch(undefined, { headers: authHeaders(token) })
		expect(status).toBe(200)
		const ended = SessionResponseSchema.parse(data)
		expect(ended.id).toBe(session.id)
		expect(ended.endedAt).not.toBeNull()
		expect(ended.abandonedAt).toBeNull()
	})

	it('returns null when ending a session that does not belong to the user', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
		const otherSession = await seedActiveSession(
			otherUserId,
			subMinutes(new Date(), 10),
		)

		const { data, status } = await api['time-tracker']({
			id: otherSession.id,
		}).end.patch(undefined, { headers: authHeaders(token) })
		expect(status).toBe(200)
		expect(data).toBeFalsy()
	})

	it('returns null when ending a non-existent session id', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const fakeId = '00000000-0000-0000-0000-000000000000'

		const { data, status } = await api['time-tracker']({
			id: fakeId,
		}).end.patch(undefined, { headers: authHeaders(token) })
		expect(status).toBe(200)
		expect(data).toBeFalsy()
	})

	it('returns 401 with no token', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		const session = await seedActiveSession(userId, subMinutes(new Date(), 10))

		const { status } = await api['time-tracker']({ id: session.id }).end.patch(
			undefined,
			{},
		)
		expect(status).toBe(401)
	})
})

// ---------------------------------------------------------------------------
// DELETE /time-tracker/:id
// ---------------------------------------------------------------------------

describe('DELETE /time-tracker/:id', () => {
	it('abandons an active session and returns it', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		const session = await seedActiveSession(userId, subMinutes(new Date(), 10))

		const { data, status } = await api['time-tracker']({
			id: session.id,
		}).delete(undefined, { headers: authHeaders(token) })
		expect(status).toBe(200)
		const abandoned = SessionResponseSchema.parse(data)
		expect(abandoned.id).toBe(session.id)
		expect(abandoned.abandonedAt).not.toBeNull()
	})

	it('returns 404 when trying to abandon an already-ended session', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		const now = new Date()
		const session = await seedCompletedSession(
			userId,
			subMinutes(now, 60),
			subMinutes(now, 30),
		)

		const { status } = await api['time-tracker']({
			id: session.id,
		}).delete(undefined, { headers: authHeaders(token) })
		expect(status).toBe(404)
	})

	it('returns 404 when trying to abandon an already-abandoned session', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		const now = new Date()
		await db.insert(timeSessions).values({
			userId,
			type: 'work',
			startedAt: subMinutes(now, 60),
			abandonedAt: subMinutes(now, 30),
		})
		const [abandonedSession] = await db.select().from(timeSessions)

		const { status } = await api['time-tracker']({
			id: abandonedSession.id,
		}).delete(undefined, { headers: authHeaders(token) })
		expect(status).toBe(404)
	})

	it('returns 404 for a session belonging to another user', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
		const otherSession = await seedActiveSession(
			otherUserId,
			subMinutes(new Date(), 10),
		)

		const { status } = await api['time-tracker']({
			id: otherSession.id,
		}).delete(undefined, { headers: authHeaders(token) })
		expect(status).toBe(404)
	})

	it('returns 404 for a non-existent session id', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const fakeId = '00000000-0000-0000-0000-000000000000'

		const { status } = await api['time-tracker']({
			id: fakeId,
		}).delete(undefined, { headers: authHeaders(token) })
		expect(status).toBe(404)
	})

	it('returns 401 with no token', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		const session = await seedActiveSession(userId, subMinutes(new Date(), 10))

		const { status } = await api['time-tracker']({ id: session.id }).delete({})
		expect(status).toBe(401)
	})
})

// ---------------------------------------------------------------------------
// Full session lifecycle integration
// ---------------------------------------------------------------------------

describe('Full session lifecycle', () => {
	it('start → active → end flow works end-to-end', async () => {
		const { token } = await registerAndGetToken(VALID_USER)

		// Start
		const { data: startedData } = await api['time-tracker'].start.post(
			{ type: 'work' },
			{ headers: authHeaders(token) },
		)
		const startedSession = SessionResponseSchema.parse(startedData)
		expect(startedSession.endedAt).toBeNull()

		// Verify it appears as active
		const { data: activeData } = await api['time-tracker'].active.get({
			headers: authHeaders(token),
		})
		const activeSession = SessionResponseSchema.parse(activeData)
		expect(activeSession.id).toBe(startedSession.id)

		// End it
		const { data: endedData } = await api['time-tracker']({
			id: startedSession.id,
		}).end.patch(undefined, { headers: authHeaders(token) })
		const endedSession = SessionResponseSchema.parse(endedData)
		expect(endedSession.endedAt).not.toBeNull()

		// No longer active
		const { data: afterEnd } = await api['time-tracker'].active.get({
			headers: authHeaders(token),
		})
		expect(afterEnd).toBeFalsy()

		// Shows up in today's summary with correct stats
		const { data: todayData } = await api['time-tracker'].today.get({
			headers: authHeaders(token),
		})
		const today = TodaySummaryResponseSchema.parse(todayData)
		expect(today.sessionsCompleted).toBe(1)
	})

	it('start → abandon flow removes session from active', async () => {
		const { token } = await registerAndGetToken(VALID_USER)

		const { data: startedData } = await api['time-tracker'].start.post(
			{ type: 'work' },
			{ headers: authHeaders(token) },
		)
		const startedSession = SessionResponseSchema.parse(startedData)

		// Abandon it
		const { status: abandonStatus } = await api['time-tracker']({
			id: startedSession.id,
		}).delete(undefined, { headers: authHeaders(token) })
		expect(abandonStatus).toBe(200)

		// No longer active
		const { data: afterAbandon } = await api['time-tracker'].active.get({
			headers: authHeaders(token),
		})
		expect(afterAbandon).toBeFalsy()

		// Not counted in today's stats
		const { data: todayData } = await api['time-tracker'].today.get({
			headers: authHeaders(token),
		})
		const today = TodaySummaryResponseSchema.parse(todayData)
		expect(today.sessionsCompleted).toBe(0)
	})

	it('multiple users are fully isolated from each other', async () => {
		const { token: tokenA } = await registerAndGetToken(VALID_USER)
		const { token: tokenB } = await registerAndGetToken(OTHER_USER)

		// User A starts a session
		const { data: sessionAData } = await api['time-tracker'].start.post(
			{ type: 'work' },
			{ headers: authHeaders(tokenA) },
		)
		const sessionA = SessionResponseSchema.parse(sessionAData)

		// User B has no active session
		const { data: activeBefore } = await api['time-tracker'].active.get({
			headers: authHeaders(tokenB),
		})
		expect(activeBefore).toBeFalsy()

		// User B's today summary is empty
		const { data: todayBData } = await api['time-tracker'].today.get({
			headers: authHeaders(tokenB),
		})
		const todayB = TodaySummaryResponseSchema.parse(todayBData)
		expect(todayB.sessions).toHaveLength(0)

		// User A ends their session
		await api['time-tracker']({
			id: sessionA.id,
		}).end.patch(undefined, { headers: authHeaders(tokenA) })

		// User B's weekly summary still shows no activity
		const { data: weeklyBData } = await api['time-tracker'].weekly.get({
			headers: authHeaders(tokenB),
		})
		const weeklyB = WeeklySummaryResponseSchema.parse(weeklyBData)
		expect(weeklyB.days[0].sessionsCompleted).toBe(0)
	})
})
