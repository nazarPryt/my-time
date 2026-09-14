import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { db } from '@db'
import { timeSessions } from '@db/schema'
import { addMinutes, subHours, subMinutes } from 'date-fns'
import { eq } from 'drizzle-orm'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { timeSessionsRepository } from '../repository'
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

afterEach(async () => {
	await cleanDatabase()
})

describe('timeSessionsRepository', () => {
	describe('getActive', () => {
		it('returns null when no session exists', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			expect(await timeSessionsRepository.getActive(userId)).toBeNull()
		})

		it('returns the open session (no endedAt, no abandonedAt)', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const session = await seedSession({ userId })
			const active = await timeSessionsRepository.getActive(userId)
			expect(active?.id).toBe(session.id)
		})

		it('ignores ended and abandoned sessions', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await seedSession({ userId, endedAt: new Date() })
			await seedSession({ userId, abandonedAt: new Date() })
			expect(await timeSessionsRepository.getActive(userId)).toBeNull()
		})

		it('is scoped to the given userId', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
			await seedSession({ userId: otherUserId })
			expect(await timeSessionsRepository.getActive(userId)).toBeNull()
		})
	})

	describe('getTodaySessions', () => {
		it('includes sessions within the given range, scoped by userId', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
			const now = new Date()
			const start = subHours(now, 12)
			const end = addMinutes(now, 1)

			const mine = await seedSession({ userId, startedAt: now })
			// outside range — ended so it doesn't conflict with `mine` under the
			// one-open-session-per-user constraint
			await seedSession({
				userId,
				startedAt: subHours(now, 24),
				endedAt: subHours(now, 23),
			})
			await seedSession({ userId: otherUserId, startedAt: now }) // other user

			const sessions = await timeSessionsRepository.getTodaySessions(
				userId,
				start,
				end,
			)
			expect(sessions).toHaveLength(1)
			expect(sessions[0]?.id).toBe(mine.id)
		})

		it('orders results ascending by startedAt', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			const later = await seedSession({ userId, startedAt: now })
			// ended so it doesn't conflict with `later` under the
			// one-open-session-per-user constraint
			const earlier = await seedSession({
				userId,
				startedAt: subMinutes(now, 30),
				endedAt: subMinutes(now, 20),
			})

			const sessions = await timeSessionsRepository.getTodaySessions(
				userId,
				subHours(now, 12),
				addMinutes(now, 1),
			)
			expect(sessions.map((s) => s.id)).toEqual([earlier.id, later.id])
		})

		it('includes abandoned and ended sessions (unlike getSessionsInRange)', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			await seedSession({ userId, startedAt: now, abandonedAt: now })

			const sessions = await timeSessionsRepository.getTodaySessions(
				userId,
				subHours(now, 1),
				addMinutes(now, 1),
			)
			expect(sessions).toHaveLength(1)
		})
	})

	describe('getSessionsInRange', () => {
		it('excludes abandoned sessions', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			await seedSession({ userId, startedAt: now, abandonedAt: now })
			const kept = await seedSession({
				userId,
				startedAt: now,
				endedAt: now,
			})

			const sessions = await timeSessionsRepository.getSessionsInRange(
				userId,
				subHours(now, 1),
				addMinutes(now, 1),
			)
			expect(sessions).toHaveLength(1)
			expect(sessions[0]?.id).toBe(kept.id)
		})

		it('is scoped to the given date range and userId', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
			const now = new Date()

			const inRange = await seedSession({ userId, startedAt: now })
			// out of range — ended so it doesn't conflict with `inRange` under the
			// one-open-session-per-user constraint
			await seedSession({
				userId,
				startedAt: subHours(now, 48),
				endedAt: subHours(now, 47),
			})
			await seedSession({ userId: otherUserId, startedAt: now }) // other user

			const sessions = await timeSessionsRepository.getSessionsInRange(
				userId,
				subHours(now, 1),
				addMinutes(now, 1),
			)
			expect(sessions).toHaveLength(1)
			expect(sessions[0]?.id).toBe(inRange.id)
		})
	})

	describe('create', () => {
		it('inserts a new open session for the given user and type', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const startedAt = new Date()
			const session = await timeSessionsRepository.create(
				userId,
				'work',
				startedAt,
			)
			expect(session?.userId).toBe(userId)
			expect(session?.type).toBe('work')
			expect(session?.endedAt).toBeNull()
			expect(session?.abandonedAt).toBeNull()
		})

		it('returns null and inserts nothing when the user already has an open session', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const existing = await seedSession({ userId })

			const result = await timeSessionsRepository.create(
				userId,
				'work',
				new Date(),
			)
			expect(result).toBeNull()

			const sessions = await db
				.select()
				.from(timeSessions)
				.where(eq(timeSessions.userId, userId))
			expect(sessions).toHaveLength(1)
			expect(sessions[0]?.id).toBe(existing.id)
		})
	})

	describe('end', () => {
		it('sets endedAt on an open session and returns it', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const session = await seedSession({ userId })
			const endedAt = new Date()

			const ended = await timeSessionsRepository.end(
				session.id,
				userId,
				endedAt,
			)
			expect(ended?.id).toBe(session.id)
			expect(ended?.endedAt).not.toBeNull()
		})

		it('returns null when the session belongs to a different user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
			const session = await seedSession({ userId: otherUserId })

			const result = await timeSessionsRepository.end(
				session.id,
				userId,
				new Date(),
			)
			expect(result).toBeNull()
		})

		it('returns null (and does not overwrite endedAt) when the session is already ended', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const firstEnd = subMinutes(new Date(), 10)
			const session = await seedSession({ userId, endedAt: firstEnd })

			const result = await timeSessionsRepository.end(
				session.id,
				userId,
				new Date(),
			)
			expect(result).toBeNull()

			const [row] = await db
				.select()
				.from(timeSessions)
				.where(eq(timeSessions.id, session.id))
			expect(row?.endedAt?.getTime()).toBe(firstEnd.getTime())
		})

		it('returns null when the session was already abandoned', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const session = await seedSession({ userId, abandonedAt: new Date() })

			const result = await timeSessionsRepository.end(
				session.id,
				userId,
				new Date(),
			)
			expect(result).toBeNull()
		})

		it('returns null for a non-existent id', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const result = await timeSessionsRepository.end(
				'00000000-0000-0000-0000-000000000000',
				userId,
				new Date(),
			)
			expect(result).toBeNull()
		})
	})

	describe('abandon', () => {
		it('sets abandonedAt on an open session and returns it', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const session = await seedSession({ userId })

			const abandoned = await timeSessionsRepository.abandon(session.id, userId)
			expect(abandoned?.id).toBe(session.id)
			expect(abandoned?.abandonedAt).not.toBeNull()
		})

		it('returns null when the session belongs to a different user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
			const session = await seedSession({ userId: otherUserId })

			expect(
				await timeSessionsRepository.abandon(session.id, userId),
			).toBeNull()
		})

		it('returns null when the session is already ended', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const session = await seedSession({ userId, endedAt: new Date() })

			expect(
				await timeSessionsRepository.abandon(session.id, userId),
			).toBeNull()
		})

		it('returns null when the session is already abandoned', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const session = await seedSession({ userId, abandonedAt: new Date() })

			expect(
				await timeSessionsRepository.abandon(session.id, userId),
			).toBeNull()
		})

		it('returns null for a non-existent id', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			expect(
				await timeSessionsRepository.abandon(
					'00000000-0000-0000-0000-000000000000',
					userId,
				),
			).toBeNull()
		})
	})

	describe('abandonStale', () => {
		it('abandons an open session started before the given cutoff', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			const stale = await seedSession({ userId, startedAt: subHours(now, 3) })

			await timeSessionsRepository.abandonStale(userId, subHours(now, 2))

			const [staleRow] = await db
				.select()
				.from(timeSessions)
				.where(eq(timeSessions.id, stale.id))
			expect(staleRow?.abandonedAt).not.toBeNull()
		})

		it('leaves an open session started after the given cutoff untouched', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			const fresh = await seedSession({ userId, startedAt: subHours(now, 1) })

			await timeSessionsRepository.abandonStale(userId, subHours(now, 2))

			const [freshRow] = await db
				.select()
				.from(timeSessions)
				.where(eq(timeSessions.id, fresh.id))
			expect(freshRow?.abandonedAt).toBeNull()
		})

		it('does not touch already-ended sessions even if stale', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			const ended = await seedSession({
				userId,
				startedAt: subHours(now, 5),
				endedAt: subHours(now, 4),
			})

			await timeSessionsRepository.abandonStale(userId, subHours(now, 2))

			const [row] = await db
				.select()
				.from(timeSessions)
				.where(eq(timeSessions.id, ended.id))
			expect(row?.abandonedAt).toBeNull()
		})

		it('is scoped to the given userId', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
			const now = new Date()
			const theirs = await seedSession({
				userId: otherUserId,
				startedAt: subHours(now, 5),
			})

			await timeSessionsRepository.abandonStale(userId, subHours(now, 2))

			const [row] = await db
				.select()
				.from(timeSessions)
				.where(eq(timeSessions.id, theirs.id))
			expect(row?.abandonedAt).toBeNull()
		})
	})
})
