import { z } from 'zod'

export const RegisterRequestSchema = z.object({
	email: z.email(),
	name: z.string().min(1),
	password: z.string().min(4),
})
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
