import type {
	ExerciseType,
	GoalResponse,
	ProgressResponse,
	SetResponse,
	TodayResponse,
} from 'contracts'
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns'
import { buildMonthDays, sumRepsByDay } from './lib/progress'
import { toGoalResponse, toSetResponse } from './lib/responses'
import { workoutGoalsRepository, workoutSetsRepository } from './repository'

function todayBounds() {
	const now = new Date()
	return { start: startOfDay(now), end: endOfDay(now) }
}

export const workoutService = {
	getToday: async (
		userId: string,
		exerciseType: ExerciseType,
	): Promise<TodayResponse> => {
		const { start, end } = todayBounds()
		const [sets, goal] = await Promise.all([
			workoutSetsRepository.getTodaySets(userId, exerciseType, start, end),
			workoutGoalsRepository.getGoal(userId, exerciseType),
		])
		const total = sets.reduce((sum, s) => sum + s.reps, 0)
		return {
			sets: sets.map(toSetResponse),
			goal: toGoalResponse(goal, exerciseType),
			total,
		}
	},

	addSet: async (
		userId: string,
		exerciseType: ExerciseType,
		reps: number,
	): Promise<SetResponse> => {
		const set = await workoutSetsRepository.addSet(userId, exerciseType, reps)
		return toSetResponse(set)
	},

	deleteSet: async (userId: string, setId: string): Promise<void> => {
		await workoutSetsRepository.deleteSet(userId, setId)
	},

	resetToday: async (
		userId: string,
		exerciseType: ExerciseType,
	): Promise<void> => {
		const { start, end } = todayBounds()
		await workoutSetsRepository.resetTodaySets(userId, exerciseType, start, end)
	},

	updateGoal: async (
		userId: string,
		exerciseType: ExerciseType,
		targetReps: number,
	): Promise<GoalResponse> => {
		const goal = await workoutGoalsRepository.upsertGoal(
			userId,
			exerciseType,
			targetReps,
		)
		return toGoalResponse(goal, exerciseType)
	},

	getProgress: async (
		userId: string,
		exerciseType: ExerciseType,
		year: number,
		month: number,
	): Promise<ProgressResponse> => {
		const firstDay = new Date(year, month - 1, 1)
		const start = startOfMonth(firstDay)
		const end = endOfMonth(firstDay)

		const [sets, goal] = await Promise.all([
			workoutSetsRepository.getMonthSets(userId, exerciseType, start, end),
			workoutGoalsRepository.getGoal(userId, exerciseType),
		])

		const totals = sumRepsByDay(sets)
		const days = buildMonthDays(firstDay, year, month, totals)

		return {
			days,
			goal: toGoalResponse(goal, exerciseType),
		}
	},
}
