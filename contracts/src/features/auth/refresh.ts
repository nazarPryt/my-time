import { z } from 'zod'

export const RefreshRequestSchema = z.object({
	refreshToken: z.string(),
})
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>
