import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { db } from '@db'
import { workoutSets } from '@db/schema'
import { addMonths, subDays, subMonths, subYears } from 'date-fns'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { workoutService } from '../service'
import { OTHER_USER, registerAndGetToken, VALID_USER } from './fixtures'

// The service falls back to this when no goal row exists yet for the
// (userId, exerciseType) pair — mirrors DEFAULT_GOAL_REPS in ../service.ts.
const DEFAULT_GOAL_REPS = 100

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})

afterEach(async () => {
	await cleanDatabase()
})

// Seeds a workout_sets row directly via drizzle so tests can control
// createdAt — the service's addSet always defaults it to now().
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

describe('workoutService', () => {
	describe('getToday', () => {
		it('returns an empty total and the default goal when nothing exists yet', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const today = await workoutService.getToday(userId, 'pushups')

			expect(today.sets).toEqual([])
			expect(today.total).toBe(0)
			expect(today.goal).toEqual({
				exerciseType: 'pushups',
				targetReps: DEFAULT_GOAL_REPS,
			})
		})

		it('aggregates the total reps across all of today’s sets', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await workoutService.addSet(userId, 'pushups', 10)
			await workoutService.addSet(userId, 'pushups', 15)

			const today = await workoutService.getToday(userId, 'pushups')
			expect(today.sets).toHaveLength(2)
			expect(today.total).toBe(25)
		})

		it('excludes sets from other days from the total', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await seedSet({ userId, reps: 50, createdAt: subDays(new Date(), 1) })
			await workoutService.addSet(userId, 'pushups', 10)

			const today = await workoutService.getToday(userId, 'pushups')
			expect(today.sets).toHaveLength(1)
			expect(today.total).toBe(10)
		})

		it('uses the real goal targetReps once one has been set', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await workoutService.updateGoal(userId, 'pushups', 200)

			const today = await workoutService.getToday(userId, 'pushups')
			expect(today.goal).toEqual({ exerciseType: 'pushups', targetReps: 200 })
		})

		it('is isolated per user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
			await workoutService.addSet(otherUserId, 'pushups', 40)

			const today = await workoutService.getToday(userId, 'pushups')
			expect(today.sets).toEqual([])
			expect(today.total).toBe(0)
		})
	})

	describe('addSet', () => {
		it('delegates to the repository and maps the response', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const set = await workoutService.addSet(userId, 'pushups', 30)

			expect(set.id).toBeTruthy()
			expect(set.exerciseType).toBe('pushups')
			expect(set.reps).toBe(30)
			expect(typeof set.createdAt).toBe('string')
		})
	})

	describe('deleteSet', () => {
		it('deletes a set owned by the user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const set = await workoutService.addSet(userId, 'pushups', 10)

			await workoutService.deleteSet(userId, set.id)

			const today = await workoutService.getToday(userId, 'pushups')
			expect(today.sets).toEqual([])
		})

		it('does not delete a set owned by a different user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
			const set = await workoutService.addSet(userId, 'pushups', 10)

			await workoutService.deleteSet(otherUserId, set.id)

			const today = await workoutService.getToday(userId, 'pushups')
			expect(today.sets).toHaveLength(1)
		})
	})

	describe('resetToday', () => {
		it("clears only today's sets, leaving other days untouched", async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await seedSet({ userId, reps: 50, createdAt: subDays(new Date(), 1) })
			await workoutService.addSet(userId, 'pushups', 10)

			await workoutService.resetToday(userId, 'pushups')

			const today = await workoutService.getToday(userId, 'pushups')
			expect(today.sets).toEqual([])
			expect(today.total).toBe(0)
		})
	})

	describe('updateGoal', () => {
		it('creates a new goal and maps the response', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const goal = await workoutService.updateGoal(userId, 'pushups', 60)
			expect(goal).toEqual({ exerciseType: 'pushups', targetReps: 60 })
		})

		it('upserts — a second call overwrites the target for the same exerciseType', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await workoutService.updateGoal(userId, 'pushups', 60)
			const goal = await workoutService.updateGoal(userId, 'pushups', 90)
			expect(goal).toEqual({ exerciseType: 'pushups', targetReps: 90 })
		})
	})

	describe('getProgress', () => {
		it('fills every day of the month with a zero total when no sets exist', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			const progress = await workoutService.getProgress(
				userId,
				'pushups',
				now.getFullYear(),
				now.getMonth() + 1,
			)

			expect(progress.days.length).toBeGreaterThanOrEqual(28)
			for (const day of progress.days) {
				expect(day.total).toBe(0)
			}
			expect(progress.goal).toEqual({
				exerciseType: 'pushups',
				targetReps: DEFAULT_GOAL_REPS,
			})
		})

		it('aggregates multiple sets on the same day into that day’s total', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()
			const fifthOfMonth = new Date(now.getFullYear(), now.getMonth(), 5, 10)

			await seedSet({ userId, reps: 10, createdAt: fifthOfMonth })
			await seedSet({
				userId,
				reps: 15,
				createdAt: new Date(now.getFullYear(), now.getMonth(), 5, 18),
			})

			const progress = await workoutService.getProgress(
				userId,
				'pushups',
				now.getFullYear(),
				now.getMonth() + 1,
			)

			const day5 = progress.days.find((d) => d.date.endsWith('-05'))
			expect(day5?.total).toBe(25)
		})

		it('excludes sets from other months and other years', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const now = new Date()

			await seedSet({ userId, reps: 99, createdAt: subMonths(now, 1) })
			await seedSet({ userId, reps: 99, createdAt: addMonths(now, 1) })
			await seedSet({ userId, reps: 99, createdAt: subYears(now, 1) })

			const progress = await workoutService.getProgress(
				userId,
				'pushups',
				now.getFullYear(),
				now.getMonth() + 1,
			)

			const total = progress.days.reduce((sum, d) => sum + d.total, 0)
			expect(total).toBe(0)
		})

		it('returns the correct number of days for the requested month', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			// February 2024 is a leap year — 29 days.
			const progress = await workoutService.getProgress(
				userId,
				'pushups',
				2024,
				2,
			)
			expect(progress.days).toHaveLength(29)
			expect(progress.days[0]?.date).toBe('2024-02-01')
			expect(progress.days[28]?.date).toBe('2024-02-29')
		})

		it('reflects the real goal once one has been set', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await workoutService.updateGoal(userId, 'pushups', 150)
			const now = new Date()

			const progress = await workoutService.getProgress(
				userId,
				'pushups',
				now.getFullYear(),
				now.getMonth() + 1,
			)
			expect(progress.goal).toEqual({
				exerciseType: 'pushups',
				targetReps: 150,
			})
		})
	})
})
