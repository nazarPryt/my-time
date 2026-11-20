import { AUTH_ERRORS, AuthErrorSchema } from '@my-time/contracts'

export function getAuthErrorMessage(error: unknown) {
	const result = AuthErrorSchema.safeParse(error)
	if (result.success) return result.data.message
	return AUTH_ERRORS.FALLBACK_MESSAGE.message
}
