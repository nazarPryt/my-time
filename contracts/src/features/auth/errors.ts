import { z } from 'zod'

export const AUTH_ERRORS = {
	INVALID_CREDENTIALS: {
		code: 'INVALID_CREDENTIALS',
		message: 'Invalid email or password',
	},
	EMAIL_TAKEN: {
		code: 'EMAIL_TAKEN',
		message: 'An account with this email already exists',
	},
	INVALID_TOKEN: {
		code: 'INVALID_TOKEN',
		message: 'Your session has expired, please log in again',
	},
	UNAUTHORIZED: {
		code: 'UNAUTHORIZED',
		message: 'Unauthorized',
	},
	FALLBACK_MESSAGE: {
		code: 'FALLBACK_MESSAGE',
		message: 'Something went wrong, please try again',
	},
} as const

export type AuthErrorCode = keyof typeof AUTH_ERRORS

const entries = Object.values(AUTH_ERRORS)

export const AuthErrorSchema = z.object({
	code: z.enum(entries.map((e) => e.code)),
	message: z.enum(entries.map((e) => e.message)),
})
