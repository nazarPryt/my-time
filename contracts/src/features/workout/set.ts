import { z } from 'zod'
import { ExerciseTypeSchema } from './exercise-type'

export const CreateSetRequestSchema = z.object({
	exerciseType: ExerciseTypeSchema.default('pushups'),
	reps: z.number().int().positive(),
})
export type CreateSetRequest = z.infer<typeof CreateSetRequestSchema>

export const DeleteSetRequestSchema = z.object({
	id: z.uuid(),
})
export type DeleteSetRequest = z.infer<typeof DeleteSetRequestSchema>

export const SetResponseSchema = z.object({
	id: z.uuid(),
	exerciseType: ExerciseTypeSchema,
	reps: z.number(),
	createdAt: z.string(),
})
export type SetResponse = z.infer<typeof SetResponseSchema>
