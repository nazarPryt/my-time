import type {
	ExerciseType,
	GoalResponse,
	ProgressDay,
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

const DEFAULT_GOAL_REPS = 100

function todayBounds() {
	const now = new Date()
	return { start: startOfDay(now), end: endOfDay(now) }
}

function toSetResponse(set: {
	id: string
	exerciseType: string
	reps: number
	createdAt: Date
}): SetResponse {
	return {
		id: set.id,
		exerciseType: ExerciseTypeSchema.parse(set.exerciseType),
		reps: set.reps,
		createdAt: set.createdAt.toISOString(),
	}
}

function toGoalResponse(
	goal: { exerciseType: string; targetReps: number } | null,
	fallbackExerciseType: ExerciseType,
): GoalResponse {
	return {
		exerciseType: ExerciseTypeSchema.parse(
			goal?.exerciseType ?? fallbackExerciseType,
		),
		targetReps: goal?.targetReps ?? DEFAULT_GOAL_REPS,
	}
}

function sumRepsByDay(sets: Array<{ createdAt: Date; reps: number }>) {
	const totals = new Map<string, number>()
	for (const s of sets) {
		const day = format(s.createdAt, 'yyyy-MM-dd')
		totals.set(day, (totals.get(day) ?? 0) + s.reps)
	}
	return totals
}

function buildMonthDays(
	firstDay: Date,
	year: number,
	month: number,
	totals: Map<string, number>,
): ProgressDay[] {
	return Array.from({ length: getDaysInMonth(firstDay) }, (_, i) => {
		const date = format(new Date(year, month - 1, i + 1), 'yyyy-MM-dd')
		return { date, total: totals.get(date) ?? 0 }
	})
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
