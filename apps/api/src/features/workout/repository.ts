import { db } from '@db'
import { workoutGoals, workoutSets } from '@db/schema'
import { and, eq, gte, lt } from 'drizzle-orm'

export const workoutSetsRepository = {
	getTodaySets: async (
		userId: string,
		exerciseType: string,
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

	addSet: async (userId: string, exerciseType: string, reps: number) => {
		const [set] = await db
			.insert(workoutSets)
			.values({ userId, exerciseType, reps })
			.returning()
		return set
	},

	resetTodaySets: async (
		userId: string,
		exerciseType: string,
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
}

export const workoutGoalsRepository = {
	getGoal: async (userId: string, exerciseType: string) => {
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
		exerciseType: string,
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
