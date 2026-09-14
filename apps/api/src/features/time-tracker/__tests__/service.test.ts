import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { db } from '@db'
import { timeSessions } from '@db/schema'
import { subDays, subHours, subMinutes } from 'date-fns'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { timeTrackerService } from '../service'
import { OTHER_USER, registerAndGetToken, VALID_USER } from './fixtures'

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})

afterEach(async () => {
	await cleanDatabase()
})

// Seeds a time_sessions row directly via drizzle so tests can control
// startedAt/endedAt/abandonedAt independently of the service.
async function seedSession(params: {
	userId: string
	startedAt?: Date
	endedAt?: Date | null
	abandonedAt?: Date | null
}) {
	const [session] = await db
		.insert(timeSessions)
		.values({
			userId: params.userId,
			type: 'work',
			startedAt: params.startedAt ?? new Date(),
			endedAt: params.endedAt ?? null,
			abandonedAt: params.abandonedAt ?? null,
		})
		.returning()
	if (!session) throw new Error('seedSession failed')
	return session
}

describe('timeTrackerService', () => {
	describe('getActive', () => {
		it('returns null when there is no open session', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			expect(await timeTrackerService.getActive(userId)).toBeNull()
		})

		it('maps the open session to a SessionResponse', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const session = await seedSession({ userId })

			const active = await timeTrackerService.getActive(userId)
			expect(active?.id).toBe(session.id)
			expect(active?.type).toBe('work')
			expect(active?.endedAt).toBeNull()
		})
	})

	describe('startSession', () => {
		it('creates and returns a new open session when none exists', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const session = await timeTrackerService.startSession(userId, 'work')
			expect(session.type).toBe('work')
			expect(session.endedAt).toBeNull()
			expect(session.abandonedAt).toBeNull()
		})

		it('returns the existing open session instead of creating a duplicate', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const existing = await seedSession({
				userId,
				startedAt: subMinutes(new Date(), 5),
			})

			const result = await timeTrackerService.startSession(userId, 'work')
			expect(result.id).toBe(existing.id)

			const sessions = await db.select().from(timeSessions)
			expect(sessions).toHaveLength(1)
		})

		it('abandons a stale (>2h) session and creates a fresh one in its place', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const stale = await seedSession({
				userId,
				startedAt: subHours(new Date(), 3),
			})

			const result = await timeTrackerService.startSession(userId, 'work')
			expect(result.id).not.toBe(stale.id)

			const active = await timeTrackerService.getActive(userId)
			expect(active?.id).toBe(result.id)
		})
	})

	describe('endSession', () => {
		it('ends an open session owned by the user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const session = await seedSession({ userId })

			const ended = await timeTrackerService.endSession(userId, session.id)
			expect(ended?.id).toBe(session.id)
			expect(ended?.endedAt).not.toBeNull()
		})

		it('returns null for a session belonging to another user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
			const theirs = await seedSession({ userId: otherUserId })

			expect(await timeTrackerService.endSession(userId, theirs.id)).toBeNull()
		})

		it('returns null when ending an already-ended session again', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const session = await seedSession({ userId, endedAt: new Date() })

			expect(await timeTrackerService.endSession(userId, session.id)).toBeNull()
		})
	})

	describe('abandonSession', () => {
		it('abandons an open session owned by the user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const session = await seedSession({ userId })

			const abandoned = await timeTrackerService.abandonSession(
				userId,
				session.id,
			)
			expect(abandoned?.id).toBe(session.id)
			expect(abandoned?.abandonedAt).not.toBeNull()
		})

		it('returns null for a non-existent session id', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			expect(
				await timeTrackerService.abandonSession(
					userId,
					'00000000-0000-0000-0000-000000000000',
				),
			).toBeNull()
		})
	})

	describe('getToday', () => {
		it('returns zeroed stats when there are no sessions', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const today = await timeTrackerService.getToday(userId)
			expect(today.sessions).toEqual([])
			expect(today.totalWorkSeconds).toBe(0)
			expect(today.sessionsCompleted).toBe(0)
			expect(today.longestSessionSeconds).toBe(0)
		})

		it('sums completed work seconds and tracks the longest session', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			await seedSession({
				userId,
				startedAt: subMinutes(now, 90),
				endedAt: subMinutes(now, 60),
			}) // 30 min
			await seedSession({
				userId,
				startedAt: subMinutes(now, 50),
				endedAt: subMinutes(now, 10),
			}) // 40 min

			const today = await timeTrackerService.getToday(userId)
			expect(today.sessionsCompleted).toBe(2)
			expect(today.totalWorkSeconds).toBeGreaterThanOrEqual(4198)
			expect(today.longestSessionSeconds).toBeGreaterThanOrEqual(2398)
		})

		it('excludes abandoned and still-open sessions from the stats', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			await seedSession({
				userId,
				startedAt: subMinutes(now, 60),
				abandonedAt: subMinutes(now, 30),
			})
			await seedSession({ userId, startedAt: subMinutes(now, 10) }) // still open

			const today = await timeTrackerService.getToday(userId)
			expect(today.sessions).toHaveLength(2)
			expect(today.sessionsCompleted).toBe(0)
			expect(today.totalWorkSeconds).toBe(0)
		})
	})

	describe('getWeeklySummary', () => {
		it('returns 30 zeroed days and a zero streak with no sessions', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const summary = await timeTrackerService.getWeeklySummary(userId)
			expect(summary.days).toHaveLength(30)
			expect(summary.currentStreakDays).toBe(0)
		})

		it('aggregates completed work into the correct day bucket', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			await seedSession({
				userId,
				startedAt: subMinutes(now, 60),
				endedAt: subMinutes(now, 30),
			})

			const summary = await timeTrackerService.getWeeklySummary(userId)
			expect(summary.days[0]?.sessionsCompleted).toBe(1)
			expect(summary.days[0]?.totalWorkSeconds).toBeGreaterThan(0)
		})

		it('counts the current streak of consecutive days with a completed session', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			for (let i = 0; i < 3; i++) {
				const base = subDays(now, i)
				await seedSession({
					userId,
					startedAt: subMinutes(base, 60),
					endedAt: subMinutes(base, 30),
				})
			}

			const summary = await timeTrackerService.getWeeklySummary(userId)
			expect(summary.currentStreakDays).toBe(3)
		})

		it('streak is 0 when today has no completed session, even with a run before it', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const yesterday = subDays(new Date(), 1)
			await seedSession({
				userId,
				startedAt: subMinutes(yesterday, 60),
				endedAt: subMinutes(yesterday, 30),
			})

			const summary = await timeTrackerService.getWeeklySummary(userId)
			expect(summary.currentStreakDays).toBe(0)
		})
	})
})
