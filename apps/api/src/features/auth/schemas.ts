import { z } from 'zod'

export const RegisterRequestSchema = z.object({
	email: z.email(),
	name: z.string().min(1),
	password: z.string().min(4),
	timezone: z.string().optional(),
})
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>

export const LoginRequestSchema = z.object({
	email: z.email(),
	password: z.string().min(1),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const RefreshRequestSchema = z.object({
	refreshToken: z.string(),
})
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>

export const LogoutRequestSchema = z.object({
	refreshToken: z.string(),
})
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>