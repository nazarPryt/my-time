import { z } from 'zod'
import { DEFAULT_EXERCISE_TYPE, ExerciseTypeSchema } from './exercise-type'

export const DEFAULT_WORKOUT_GOAL_REPS = 100

export const UpdateGoalRequestSchema = z.object({
	exerciseType: ExerciseTypeSchema.default(DEFAULT_EXERCISE_TYPE),
	targetReps: z.number().int().positive(),
})
export type UpdateGoalRequest = z.infer<typeof UpdateGoalRequestSchema>

export const GoalResponseSchema = z.object({
	exerciseType: ExerciseTypeSchema,
	targetReps: z.number(),
})
export type GoalResponse = z.infer<typeof GoalResponseSchema>
