import type {
	ExerciseType,
	GoalResponse,
	ProgressResponse,
	SetResponse,
	TodayResponse,
} from 'contracts'
import { ExerciseTypeSchema } from 'contracts'
import {
	endOfDay,
	endOfMonth,
	format,
	getDaysInMonth,
	startOfDay,
	startOfMonth,
} from 'date-fns'
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
			sets: sets.map((s) => ({
				id: s.id,
				exerciseType: ExerciseTypeSchema.parse(s.exerciseType),
				reps: s.reps,
				createdAt: s.createdAt.toISOString(),
			})),
			goal: {
				exerciseType: ExerciseTypeSchema.parse(
					goal?.exerciseType ?? exerciseType,
				),
				targetReps: goal?.targetReps ?? 100,
			},
			total,
		}
	},

	addSet: async (
		userId: string,
		exerciseType: ExerciseType,
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
		return {
			exerciseType: ExerciseTypeSchema.parse(goal.exerciseType),
			targetReps: goal.targetReps,
		}
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

		// Aggregate reps per calendar day
		const totals = new Map<string, number>()
		for (const s of sets) {
			const day = format(s.createdAt, 'yyyy-MM-dd')
			totals.set(day, (totals.get(day) ?? 0) + s.reps)
		}

		// Return all days in the month, filling zeros for days with no sets
		const days = Array.from({ length: getDaysInMonth(firstDay) }, (_, i) => {
			const date = format(new Date(year, month - 1, i + 1), 'yyyy-MM-dd')
			return { date, total: totals.get(date) ?? 0 }
		})

		return {
			days,
			goal: {
				exerciseType: ExerciseTypeSchema.parse(
					goal?.exerciseType ?? exerciseType,
				),
				targetReps: goal?.targetReps ?? 100,
			},
		}
	},
}
