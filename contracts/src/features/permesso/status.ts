import { z } from 'zod'

export const PermessoStatusResponseSchema = z.object({
	practiceNumber: z.string().nullable(),
	checkHours: z.array(z.number().int().min(0).max(23)),
	lastStatus: z.string().nullable(),
	lastCheckedAt: z.string().nullable(),
	lastError: z.string().nullable(),
})
export type PermessoStatusResponse = z.infer<
	typeof PermessoStatusResponseSchema
>
