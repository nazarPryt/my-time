import { z } from 'zod'

export const UpdateGoalRequestSchema = z.object({
	exerciseType: z.string().default('pushups'),
	targetReps: z.number().int().positive(),
})
export type UpdateGoalRequest = z.infer<typeof UpdateGoalRequestSchema>

export const GoalResponseSchema = z.object({
	exerciseType: z.string(),
	targetReps: z.number(),
})
export type GoalResponse = z.infer<typeof GoalResponseSchema>
