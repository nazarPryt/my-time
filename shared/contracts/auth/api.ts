import { z } from 'zod'
import { TokensSchema } from '../common'
import { UserSchema } from './types'

// POST /auth/register
export const RegisterRequestSchema = z.object({
	email: z.string().email(),
	name: z.string().min(1),
	password: z.string().min(4),
	timezone: z.string().optional(), // defaults to UTC on the server if omitted
})
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>

export const RegisterResponseSchema = z.object({
	user: UserSchema,
	tokens: TokensSchema,
})
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>

// POST /auth/login
export const LoginRequestSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const LoginResponseSchema = z.object({
	user: UserSchema,
	tokens: TokensSchema,
})
export type LoginResponse = z.infer<typeof LoginResponseSchema>

// POST /auth/refresh
export const RefreshRequestSchema = z.object({
	refreshToken: z.string(),
})
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>

export const RefreshResponseSchema = z.object({
	tokens: TokensSchema,
})
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>

// POST /auth/logout
export const LogoutRequestSchema = z.object({
	refreshToken: z.string(),
})
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>
// 204 No Content — no response body

// GET /auth/me
export const MeResponseSchema = z.object({
	user: UserSchema,
})
export type MeResponse = z.infer<typeof MeResponseSchema>
