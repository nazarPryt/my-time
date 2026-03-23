import { db } from '@db'
import { workoutGoals, workoutSets } from '@db/schema'
import type { ExerciseType } from 'contracts'
import { and, eq, gte, lt } from 'drizzle-orm'

export const workoutSetsRepository = {
	getTodaySets: async (
		userId: string,
		exerciseType: ExerciseType,
		startOfDay: Date,
		endOfDay: Date,
	) => {
		return db
			.select()
			.from(workoutSets)
			.where(
				and(
					eq(workoutSets.userId, userId),
					eq(workoutSets.exerciseType, exerciseType),
					gte(workoutSets.createdAt, startOfDay),
					lt(workoutSets.createdAt, endOfDay),
				),
			)
	},

	addSet: async (userId: string, exerciseType: ExerciseType, reps: number) => {
		const [set] = await db
			.insert(workoutSets)
			.values({ userId, exerciseType, reps })
			.returning()
		return set
	},

	deleteSet: async (userId: string, setId: string) => {
		await db
			.delete(workoutSets)
			.where(and(eq(workoutSets.id, setId), eq(workoutSets.userId, userId)))
	},

	resetTodaySets: async (
		userId: string,
		exerciseType: ExerciseType,
		startOfDay: Date,
		endOfDay: Date,
	) => {
		await db
			.delete(workoutSets)
			.where(
				and(
					eq(workoutSets.userId, userId),
					eq(workoutSets.exerciseType, exerciseType),
					gte(workoutSets.createdAt, startOfDay),
					lt(workoutSets.createdAt, endOfDay),
				),
			)
	},

	getMonthSets: async (
		userId: string,
		exerciseType: ExerciseType,
		start: Date,
		end: Date,
	) => {
		return db
			.select({
				createdAt: workoutSets.createdAt,
				reps: workoutSets.reps,
			})
			.from(workoutSets)
			.where(
				and(
					eq(workoutSets.userId, userId),
					eq(workoutSets.exerciseType, exerciseType),
					gte(workoutSets.createdAt, start),
					lt(workoutSets.createdAt, end),
				),
			)
	},
}

export const workoutGoalsRepository = {
	getGoal: async (userId: string, exerciseType: ExerciseType) => {
		const [goal] = await db
			.select()
			.from(workoutGoals)
			.where(
				and(
					eq(workoutGoals.userId, userId),
					eq(workoutGoals.exerciseType, exerciseType),
				),
			)
		return goal ?? null
	},

	upsertGoal: async (
		userId: string,
		exerciseType: ExerciseType,
		targetReps: number,
	) => {
		const [goal] = await db
			.insert(workoutGoals)
			.values({ userId, exerciseType, targetReps })
			.onConflictDoUpdate({
				target: [workoutGoals.userId, workoutGoals.exerciseType],
				set: { targetReps, updatedAt: new Date() },
			})
			.returning()
		return goal
	},
}
