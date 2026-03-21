import { endOfDay, startOfDay } from 'date-fns'
import { workoutGoalsRepository, workoutSetsRepository } from './repository'
import type { GoalResponse, SetResponse, TodayResponse } from './schemas'
import { ExerciseTypeSchema } from './schemas'

function todayBounds() {
	const now = new Date()
	return { start: startOfDay(now), end: endOfDay(now) }
}

export const workoutService = {
	getToday: async (
		userId: string,
		exerciseType: string,
	): Promise<TodayResponse> => {
		const { start, end } = todayBounds()
		const [sets, goal] = await Promise.all([
			workoutSetsRepository.getTodaySets(userId, exerciseType, start, end),
			workoutGoalsRepository.getGoal(userId, exerciseType),
		])
		const total = sets.reduce((sum, s) => sum + s.reps, 0)
		return {
			sets: sets.map((s) => ({
				id: s.id,
				exerciseType: ExerciseTypeSchema.parse(s.exerciseType),
				reps: s.reps,
				createdAt: s.createdAt.toISOString(),
			})),
			goal: {
				exerciseType: ExerciseTypeSchema.parse(goal?.exerciseType ?? exerciseType),
				targetReps: goal?.targetReps ?? 100,
			},
			total,
		}
	},

	addSet: async (
		userId: string,
		exerciseType: string,
		reps: number,
	): Promise<SetResponse> => {
		const set = await workoutSetsRepository.addSet(userId, exerciseType, reps)
		return {
			id: set.id,
			exerciseType: ExerciseTypeSchema.parse(set.exerciseType),
			reps: set.reps,
			createdAt: set.createdAt.toISOString(),
		}
	},

	resetToday: async (userId: string, exerciseType: string): Promise<void> => {
		const { start, end } = todayBounds()
		await workoutSetsRepository.resetTodaySets(userId, exerciseType, start, end)
	},

	updateGoal: async (
		userId: string,
		exerciseType: string,
		targetReps: number,
	): Promise<GoalResponse> => {
		const goal = await workoutGoalsRepository.upsertGoal(
			userId,
			exerciseType,
			targetReps,
		)
		return {
			exerciseType: ExerciseTypeSchema.parse(goal.exerciseType),
			targetReps: goal.targetReps,
		}
	},
}