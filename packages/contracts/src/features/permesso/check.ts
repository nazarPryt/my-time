import { z } from 'zod'

export const CheckResultResponseSchema = z.object({
	success: z.boolean(),
	status: z.string().nullable(),
	error: z.string().nullable(),
	checkedAt: z.string(),
})
export type CheckResultResponse = z.infer<typeof CheckResultResponseSchema>
