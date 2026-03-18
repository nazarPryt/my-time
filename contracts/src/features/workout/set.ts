import { z } from 'zod'

export const CreateSetRequestSchema = z.object({
	exerciseType: z.string().default('pushups'),
	reps: z.number().int().positive(),
})
export type CreateSetRequest = z.infer<typeof CreateSetRequestSchema>

export const SetResponseSchema = z.object({
	id: z.uuid(),
	exerciseType: z.string(),
	reps: z.number(),
	createdAt: z.string(),
})
export type SetResponse = z.infer<typeof SetResponseSchema>
