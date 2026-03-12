import { z } from 'zod'

export const TokensSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
})
export type Tokens = z.infer<typeof TokensSchema>

export const ApiErrorSchema = z.object({
	code: z.string(),
	message: z.string(),
})
export type ApiError = z.infer<typeof ApiErrorSchema>

// Generic wrapper — kept as a plain type since Zod generics are verbose
export interface ApiResponse<T> {
	data: T
}
