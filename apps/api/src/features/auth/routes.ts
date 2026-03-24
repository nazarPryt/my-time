import { jwt } from '@elysiajs/jwt'
import { API_CONFIG } from '@shared/api-config'
import {
	AUTH_ERRORS,
	AuthErrorSchema,
	AuthResponseSchema,
	LoginRequestSchema,
	MeResponseSchema,
	RegisterRequestSchema,
} from 'contracts'
import { Elysia, t } from 'elysia'
import { REFRESH_TOKEN } from './constants'
import { refreshTokenRepository } from './repository'
import { authService } from './service'
import { generateTokens } from './token'

const jwtPlugin = jwt({
	name: 'jwt',
	secret: API_CONFIG.JWT_SECRET,
})
const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: true,
	sameSite: 'strict',
	maxAge: 7 * 24 * 60 * 60, // 7 days
	path: '/',
} as const

export const authPlugin = new Elysia({ prefix: '/auth' })
	.use(jwtPlugin)
	.post(
		'/register',
		async ({ body, jwt, status, cookie }) => {
			try {
				const user = await authService.register(body)
				const tokens = await generateTokens(jwt, user.id)
				cookie[REFRESH_TOKEN].set({
					value: tokens.refreshToken,
					...COOKIE_OPTIONS,
				})
				return AuthResponseSchema.parse({
					user,
					tokens: { accessToken: tokens.accessToken },
				})
			} catch (e: unknown) {
				if (e instanceof Error && e.message === AUTH_ERRORS.EMAIL_TAKEN.code) {
					return status('Conflict', AUTH_ERRORS.EMAIL_TAKEN)
				}
				throw e
			}
		},
		{
			body: RegisterRequestSchema,
			response: { Conflict: AuthErrorSchema },
		},
	)
	.post(
		'/login',
		async ({ body, jwt, status, cookie }) => {
			try {
				const user = await authService.login(body)
				const tokens = await generateTokens(jwt, user.id)
				cookie[REFRESH_TOKEN].set({
					value: tokens.refreshToken,
					...COOKIE_OPTIONS,
				})
				return { user, tokens: { accessToken: tokens.accessToken } }
			} catch {
				return status('Unauthorized', AUTH_ERRORS.INVALID_CREDENTIALS)
			}
		},
		{
			body: LoginRequestSchema,
			response: { Unauthorized: AuthErrorSchema },
		},
	)
	.post(
		'/refresh',
		async ({ jwt, status, cookie: { refreshToken: refreshCookie } }) => {
			const token = refreshCookie.value
			if (!token) {
				return status('Unauthorized', AUTH_ERRORS.INVALID_TOKEN)
			}
			// Atomically consume the token — only one concurrent request can succeed
			const consumed = await refreshTokenRepository.consume(token)
			if (!consumed) {
				return status('Unauthorized', AUTH_ERRORS.INVALID_TOKEN)
			}
			const payload = await jwt.verify(token)
			if (!payload || typeof payload.sub !== 'string') {
				return status('Unauthorized', AUTH_ERRORS.INVALID_TOKEN)
			}
			await refreshTokenRepository.deleteExpired().catch((err) => {
				console.error('Failed to purge expired tokens:', err)
			})
			const tokens = await generateTokens(jwt, payload.sub)
			refreshCookie.set({ value: tokens.refreshToken, ...COOKIE_OPTIONS })
			return { tokens: { accessToken: tokens.accessToken } }
		},
		{
			cookie: t.Cookie({ refreshToken: t.Optional(t.String()) }),
			response: { Unauthorized: AuthErrorSchema },
		},
	)
	.post(
		'/logout',
		async ({ cookie: { refreshToken: refreshCookie } }) => {
			const token = refreshCookie.value
			if (token) {
				await refreshTokenRepository.remove(token)
			}
			refreshCookie.remove()
		},
		{ cookie: t.Cookie({ refreshToken: t.Optional(t.String()) }) },
	)
	.get(
		'/me',
		async ({ headers, jwt, status }) => {
			const auth = headers.authorization
			const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
			const payload = token ? await jwt.verify(token) : null
			if (!payload || typeof payload.sub !== 'string') {
				return status('Unauthorized', AUTH_ERRORS.UNAUTHORIZED)
			}
			const user = await authService.getById(payload.sub)
			return MeResponseSchema.parse(user)
		},
		{
			response: { Unauthorized: AuthErrorSchema },
		},
	)
