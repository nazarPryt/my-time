import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { db } from '@db'
import { workoutSets } from '@db/schema'
import {
	addDays,
	addMonths,
	endOfDay,
	endOfMonth,
	startOfDay,
	startOfMonth,
	subDays,
	subMonths,
} from 'date-fns'
import { eq } from 'drizzle-orm'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { workoutGoalsRepository, workoutSetsRepository } from '../repository'
import { OTHER_USER, registerAndGetToken, VALID_USER } from './fixtures'

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})

afterEach(async () => {
	await cleanDatabase()
})

// Seeds a workout_sets row directly via drizzle so tests can control
// createdAt (the repository's addSet always defaults it to now()) and, for
// isolation tests, use an exerciseType outside the current ExerciseType enum
// — the column itself is plain text with no DB-level check constraint.
async function seedSet(params: {
	userId: string
	exerciseType?: string
	reps?: number
	createdAt?: Date
}) {
	const [set] = await db
		.insert(workoutSets)
		.values({
			userId: params.userId,
			exerciseType: params.exerciseType ?? 'pushups',
			reps: params.reps ?? 10,
			createdAt: params.createdAt ?? new Date(),
		})
		.returning()
	if (!set) throw new Error('seedSet failed')
	return set
}

describe('workoutSetsRepository', () => {
	describe('getTodaySets', () => {
		it('returns an empty array when no sets exist', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			const sets = await workoutSetsRepository.getTodaySets(
				userId,
				'pushups',
				startOfDay(now),
				endOfDay(now),
			)
			expect(sets).toEqual([])
		})

		it('excludes sets from yesterday and tomorrow, including only today', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()

			await seedSet({ userId, createdAt: subDays(now, 1) })
			await seedSet({ userId, createdAt: addDays(now, 1) })
			const today = await seedSet({ userId, createdAt: now })

			const sets = await workoutSetsRepository.getTodaySets(
				userId,
				'pushups',
				startOfDay(now),
				endOfDay(now),
			)
			expect(sets).toHaveLength(1)
			expect(sets[0]?.id).toBe(today.id)
		})

		it('includes a set exactly at the start of day and excludes one exactly at the end of day', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			const start = startOfDay(now)
			const end = endOfDay(now)

			const atStart = await seedSet({ userId, createdAt: start })
			await seedSet({ userId, createdAt: end })

			const sets = await workoutSetsRepository.getTodaySets(
				userId,
				'pushups',
				start,
				end,
			)
			expect(sets).toHaveLength(1)
			expect(sets[0]?.id).toBe(atStart.id)
		})

		it('is scoped to the given userId', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
			const now = new Date()

			await seedSet({ userId: otherUserId, createdAt: now })

			const sets = await workoutSetsRepository.getTodaySets(
				userId,
				'pushups',
				startOfDay(now),
				endOfDay(now),
			)
			expect(sets).toEqual([])
		})

		it('is scoped to the given exerciseType', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()

			await seedSet({ userId, exerciseType: 'situps', createdAt: now })
			const pushupSet = await seedSet({ userId, createdAt: now })

			const sets = await workoutSetsRepository.getTodaySets(
				userId,
				'pushups',
				startOfDay(now),
				endOfDay(now),
			)
			expect(sets).toHaveLength(1)
			expect(sets[0]?.id).toBe(pushupSet.id)
		})
	})

	describe('addSet', () => {
		it('inserts a new row and returns it', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const set = await workoutSetsRepository.addSet(userId, 'pushups', 25)

			expect(set?.userId).toBe(userId)
			expect(set?.exerciseType).toBe('pushups')
			expect(set?.reps).toBe(25)
			expect(set?.id).toBeTruthy()
			expect(set?.createdAt).toBeInstanceOf(Date)
		})
	})

	describe('deleteSet', () => {
		it('deletes a set that belongs to the given user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const set = await workoutSetsRepository.addSet(userId, 'pushups', 10)

			await workoutSetsRepository.deleteSet(userId, set.id)

			const remaining = await db
				.select()
				.from(workoutSets)
				.where(eq(workoutSets.userId, userId))
			expect(remaining).toEqual([])
		})

		it('is a no-op when the id belongs to a different user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
			const set = await workoutSetsRepository.addSet(userId, 'pushups', 10)

			await workoutSetsRepository.deleteSet(otherUserId, set.id)

			const remaining = await db
				.select()
				.from(workoutSets)
				.where(eq(workoutSets.userId, userId))
			expect(remaining).toHaveLength(1)
			expect(remaining[0]?.id).toBe(set.id)
		})

		it('is a no-op for a non-existent id', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await expect(
				workoutSetsRepository.deleteSet(
					userId,
					'00000000-0000-0000-0000-000000000000',
				),
			).resolves.toBeUndefined()
		})
	})

	describe('resetTodaySets', () => {
		it("only clears today's sets for the given exerciseType", async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			const start = startOfDay(now)
			const end = endOfDay(now)

			const todayPushups = await seedSet({ userId, createdAt: now })
			const yesterdayPushups = await seedSet({
				userId,
				createdAt: subDays(now, 1),
			})
			const todaySitups = await seedSet({
				userId,
				exerciseType: 'situps',
				createdAt: now,
			})

			await workoutSetsRepository.resetTodaySets(userId, 'pushups', start, end)

			const remaining = await db
				.select()
				.from(workoutSets)
				.where(eq(workoutSets.userId, userId))
			const remainingIds = remaining.map((r) => r.id)
			expect(remainingIds).not.toContain(todayPushups.id)
			expect(remainingIds).toContain(yesterdayPushups.id)
			expect(remainingIds).toContain(todaySitups.id)
		})

		it('is scoped to the given userId', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
			const now = new Date()

			await seedSet({ userId, createdAt: now })
			const theirs = await seedSet({ userId: otherUserId, createdAt: now })

			await workoutSetsRepository.resetTodaySets(
				userId,
				'pushups',
				startOfDay(now),
				endOfDay(now),
			)

			const mine = await db
				.select()
				.from(workoutSets)
				.where(eq(workoutSets.userId, userId))
			const theirsRemaining = await db
				.select()
				.from(workoutSets)
				.where(eq(workoutSets.userId, otherUserId))
			expect(mine).toEqual([])
			expect(theirsRemaining).toHaveLength(1)
			expect(theirsRemaining[0]?.id).toBe(theirs.id)
		})
	})

	describe('getMonthSets', () => {
		it('excludes sets from the previous and next month, including only the given month', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			const start = startOfMonth(now)
			const end = endOfMonth(now)

			await seedSet({ userId, createdAt: subMonths(start, 1) })
			await seedSet({ userId, createdAt: addMonths(end, 1) })
			await seedSet({ userId, createdAt: now, reps: 15 })

			const sets = await workoutSetsRepository.getMonthSets(
				userId,
				'pushups',
				start,
				end,
			)
			expect(sets).toHaveLength(1)
			expect(sets[0]?.reps).toBe(15)
		})

		it('aggregates multiple sets within the month', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			const start = startOfMonth(now)
			const end = endOfMonth(now)

			await seedSet({ userId, createdAt: now, reps: 10 })
			await seedSet({ userId, createdAt: now, reps: 20 })

			const sets = await workoutSetsRepository.getMonthSets(
				userId,
				'pushups',
				start,
				end,
			)
			expect(sets).toHaveLength(2)
			expect(sets.reduce((sum, s) => sum + s.reps, 0)).toBe(30)
		})

		it('is scoped to the given userId and exerciseType', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
			const now = new Date()

			await seedSet({ userId: otherUserId, createdAt: now })
			await seedSet({ userId, exerciseType: 'situps', createdAt: now })

			const sets = await workoutSetsRepository.getMonthSets(
				userId,
				'pushups',
				startOfMonth(now),
				endOfMonth(now),
			)
			expect(sets).toEqual([])
		})
	})
})

describe('workoutGoalsRepository', () => {
	describe('getGoal', () => {
		it('returns null when no goal row exists', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const goal = await workoutGoalsRepository.getGoal(userId, 'pushups')
			expect(goal).toBeNull()
		})

		it('returns the goal row for the given user and exerciseType', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await workoutGoalsRepository.upsertGoal(userId, 'pushups', 50)

			const goal = await workoutGoalsRepository.getGoal(userId, 'pushups')
			expect(goal?.userId).toBe(userId)
			expect(goal?.exerciseType).toBe('pushups')
			expect(goal?.targetReps).toBe(50)
		})
	})

	describe('upsertGoal', () => {
		it('inserts a new row on the first call', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const goal = await workoutGoalsRepository.upsertGoal(
				userId,
				'pushups',
				50,
			)
			expect(goal?.targetReps).toBe(50)
		})

		it('updates targetReps on conflict for the same (userId, exerciseType)', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await workoutGoalsRepository.upsertGoal(userId, 'pushups', 50)
			const updated = await workoutGoalsRepository.upsertGoal(
				userId,
				'pushups',
				75,
			)

			expect(updated?.targetReps).toBe(75)

			const goal = await workoutGoalsRepository.getGoal(userId, 'pushups')
			expect(goal?.targetReps).toBe(75)
		})

		it('keeps goals independent per user for the same exerciseType', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)

			await workoutGoalsRepository.upsertGoal(userId, 'pushups', 50)
			await workoutGoalsRepository.upsertGoal(otherUserId, 'pushups', 200)

			const mine = await workoutGoalsRepository.getGoal(userId, 'pushups')
			const theirs = await workoutGoalsRepository.getGoal(
				otherUserId,
				'pushups',
			)
			expect(mine?.targetReps).toBe(50)
			expect(theirs?.targetReps).toBe(200)
		})
	})
})
