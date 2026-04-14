import { jwt } from '@elysiajs/jwt'
import { API_CONFIG } from '@shared/api-config'
import {
	AUTH_ERRORS,
	AuthErrorSchema,
	AuthResponseSchema,
	ExchangeExtensionTokenRequestSchema,
	ExtensionRefreshRequestSchema,
	LoginRequestSchema,
	MeResponseSchema,
	RegisterRequestSchema,
} from 'contracts'
import { type CookieOptions, Elysia, t } from 'elysia'
import { REFRESH_TOKEN } from './constants'
import { extensionTokenRepository, refreshTokenRepository } from './repository'
import { authService } from './service'
import { generateTokens } from './token'

const jwtPlugin = jwt({
	name: 'jwt',
	secret: API_CONFIG.JWT_SECRET,
})
const COOKIE_OPTIONS: CookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: 'strict',
	maxAge: 7 * 24 * 60 * 60, // 7 days
	path: '/',
}

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
	// Generates a short-lived one-time token for passwordless extension auth.
	// Requires a valid Bearer access token (user must be logged in on the web).
	.post(
		'/extension-token',
		async ({ headers, jwt, status }) => {
			const auth = headers.authorization
			const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
			const payload = token ? await jwt.verify(token) : null
			if (!payload || typeof payload.sub !== 'string') {
				return status('Unauthorized', AUTH_ERRORS.UNAUTHORIZED)
			}
			const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
			const row = await extensionTokenRepository.create(payload.sub, expiresAt)
			return { token: row.token }
		},
		{
			response: { Unauthorized: AuthErrorSchema },
		},
	)
	// Exchanges a one-time extension token for a JWT access + refresh token pair.
	// Returns tokens in the response body (not cookies) for extension storage.
	.post(
		'/exchange-extension-token',
		async ({ body, jwt, status }) => {
			const consumed = await extensionTokenRepository.consume(body.token)
			if (!consumed) {
				return status('Unauthorized', AUTH_ERRORS.INVALID_TOKEN)
			}
			const tokens = await generateTokens(jwt, consumed.userId)
			return tokens
		},
		{
			body: ExchangeExtensionTokenRequestSchema,
			response: { Unauthorized: AuthErrorSchema },
		},
	)
	// Extension-specific login: returns both tokens in body (no cookies) so the
	// extension can store them in browser.storage.local.
	.post(
		'/login-extension',
		async ({ body, jwt, status }) => {
			try {
				const user = await authService.login(body)
				const tokens = await generateTokens(jwt, user.id)
				return {
					accessToken: tokens.accessToken,
					refreshToken: tokens.refreshToken,
				}
			} catch {
				return status('Unauthorized', AUTH_ERRORS.INVALID_CREDENTIALS)
			}
		},
		{
			body: LoginRequestSchema,
			response: { Unauthorized: AuthErrorSchema },
		},
	)
	// Extension-specific token refresh: accepts the refresh token in the request
	// body and returns new tokens in the body (no cookies) for extension storage.
	.post(
		'/refresh-extension',
		async ({ body, jwt, status }) => {
			const consumed = await refreshTokenRepository.consume(body.refreshToken)
			if (!consumed) {
				return status('Unauthorized', AUTH_ERRORS.INVALID_TOKEN)
			}
			const payload = await jwt.verify(body.refreshToken)
			if (!payload || typeof payload.sub !== 'string') {
				return status('Unauthorized', AUTH_ERRORS.INVALID_TOKEN)
			}
			await refreshTokenRepository.deleteExpired().catch((err) => {
				console.error('Failed to purge expired tokens:', err)
			})
			const tokens = await generateTokens(jwt, payload.sub)
			return {
				accessToken: tokens.accessToken,
				refreshToken: tokens.refreshToken,
			}
		},
		{
			body: ExtensionRefreshRequestSchema,
			response: { Unauthorized: AuthErrorSchema },
		},
	)
