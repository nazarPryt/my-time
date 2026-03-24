import { jwt } from '@elysiajs/jwt'
import { API_CONFIG } from '@shared/api-config'
import {
	AuthResponseSchema,
	LoginRequestSchema,
	MeResponseSchema,
	RegisterRequestSchema,
} from 'contracts'
import { Elysia, t } from 'elysia'
import { refreshTokenRepository } from './repository'
import { authService } from './service'
import { generateTokens } from './token'

const jwtPlugin = jwt({
	name: 'jwt',
	secret: API_CONFIG.JWT_SECRET,
})

const AuthErrorSchema = t.Object({ code: t.String(), message: t.String() })

const REFRESH_COOKIE = 'refreshToken'
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
				cookie[REFRESH_COOKIE].set({
					value: tokens.refreshToken,
					...COOKIE_OPTIONS,
				})
				return AuthResponseSchema.parse({
					user,
					tokens: { accessToken: tokens.accessToken },
				})
			} catch (e: unknown) {
				if (e instanceof Error && e.message === 'EMAIL_TAKEN') {
					return status('Conflict', {
						code: 'EMAIL_TAKEN',
						message: 'Email already registered',
					})
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
				cookie[REFRESH_COOKIE].set({
					value: tokens.refreshToken,
					...COOKIE_OPTIONS,
				})
				return { user, tokens: { accessToken: tokens.accessToken } }
			} catch {
				return status('Unauthorized', {
					code: 'INVALID_CREDENTIALS',
					message: 'Invalid email or password',
				})
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
				return status('Unauthorized', {
					code: 'INVALID_TOKEN',
					message: 'Refresh token invalid or expired',
				})
			}
			const valid = await refreshTokenRepository.exists(token)
			if (!valid) {
				return status('Unauthorized', {
					code: 'INVALID_TOKEN',
					message: 'Refresh token invalid or expired',
				})
			}
			const payload = await jwt.verify(token)
			if (!payload || typeof payload.sub !== 'string') {
				return status('Unauthorized', {
					code: 'INVALID_TOKEN',
					message: 'Refresh token invalid or expired',
				})
			}
			await refreshTokenRepository.remove(token)
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
			if (!auth?.startsWith('Bearer ')) {
				return status('Unauthorized', {
					code: 'UNAUTHORIZED',
					message: 'Missing token',
				})
			}
			const payload = await jwt.verify(auth.slice(7))
			if (!payload || typeof payload.sub !== 'string') {
				return status('Unauthorized', {
					code: 'UNAUTHORIZED',
					message: 'Invalid token',
				})
			}
			const user = await authService.getById(payload.sub)
			return MeResponseSchema.parse(user)
		},
		{
			response: { Unauthorized: AuthErrorSchema },
		},
	)
