import { z } from 'zod'

export const MeResponseSchema = z.object({
	id: z.string(),
	email: z.string(),
	name: z.string(),
	timezone: z.string().nullable(),
})
export type MeResponse = z.infer<typeof MeResponseSchema>
