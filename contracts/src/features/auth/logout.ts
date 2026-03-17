import { z } from 'zod'

export const LogoutRequestSchema = z.object({
	refreshToken: z.string(),
})
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>
