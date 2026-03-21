import { z } from 'zod'
import { ExerciseTypeSchema } from './exercise-type'

export const UpdateGoalRequestSchema = z.object({
	exerciseType: ExerciseTypeSchema.default('pushups'),
	targetReps: z.number().int().positive(),
})
export type UpdateGoalRequest = z.infer<typeof UpdateGoalRequestSchema>

export const GoalResponseSchema = z.object({
	exerciseType: ExerciseTypeSchema,
	targetReps: z.number(),
})
export type GoalResponse = z.infer<typeof GoalResponseSchema>
