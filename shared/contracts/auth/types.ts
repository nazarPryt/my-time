import { z } from 'zod'

export const UserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	name: z.string().min(1),
	timezone: z.string(), // e.g. "Europe/Warsaw"
	createdAt: z.string(), // ISO 8601
})
export type User = z.infer<typeof UserSchema>
