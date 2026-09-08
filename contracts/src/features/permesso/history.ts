import { z } from 'zod'

export const PermessoCheckHistoryItemSchema = z.object({
	id: z.string().uuid(),
	success: z.boolean(),
	status: z.string().nullable(),
	error: z.string().nullable(),
	triggeredBy: z.enum(['manual', 'scheduled']),
	checkedAt: z.string(),
})
export type PermessoCheckHistoryItem = z.infer<
	typeof PermessoCheckHistoryItemSchema
>

export const PermessoCheckHistoryResponseSchema = z.array(
	PermessoCheckHistoryItemSchema,
)
export type PermessoCheckHistoryResponse = z.infer<
	typeof PermessoCheckHistoryResponseSchema
>
