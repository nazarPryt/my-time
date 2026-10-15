import {
	DEFAULT_WORKOUT_GOAL_REPS,
	type ExerciseType,
	ExerciseTypeSchema,
	type GoalResponse,
	type SetResponse,
} from 'contracts'
import type { WorkoutGoalRecord, WorkoutSetRecord } from '../types'

export function toSetResponse(set: WorkoutSetRecord): SetResponse {
	return {
		id: set.id,
		exerciseType: ExerciseTypeSchema.parse(set.exerciseType),
		reps: set.reps,
		createdAt: set.createdAt.toISOString(),
	}
}

export function toGoalResponse(
	goal: WorkoutGoalRecord | null,
	fallbackExerciseType: ExerciseType,
): GoalResponse {
	return {
		exerciseType: ExerciseTypeSchema.parse(
			goal?.exerciseType ?? fallbackExerciseType,
		),
		targetReps: goal?.targetReps ?? DEFAULT_WORKOUT_GOAL_REPS,
	}
}
