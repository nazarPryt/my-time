import { z } from 'zod'
import { MeResponseSchema } from './me'

export const AuthTokensSchema = z.object({
	accessToken: z.string(),
})
export type AuthTokens = z.infer<typeof AuthTokensSchema>

export const AuthResponseSchema = z.object({
	user: MeResponseSchema,
	tokens: AuthTokensSchema,
})
export type AuthResponse = z.infer<typeof AuthResponseSchema>

export const RefreshResponseSchema = z.object({
	tokens: AuthTokensSchema,
})
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>
