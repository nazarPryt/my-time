import { jwt } from '@elysiajs/jwt'
import { API_CONFIG } from '@shared/api-config'
import { authMacro } from '@shared/auth-macro'
import {
	AUTH_ERRORS,
	AUTH_ROUTES,
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
import { authService } from './service'

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

export const authPlugin = new Elysia({ prefix: AUTH_ROUTES.prefix })
	.use(jwtPlugin)
	.use(authMacro)
	.post(
		AUTH_ROUTES.register,
		async ({ body, jwt, status, cookie }) => {
			try {
				const user = await authService.register(body)
				const tokens = await authService.signAndSaveTokens(jwt, user.id)
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
		AUTH_ROUTES.login,
		async ({ body, jwt, status, cookie }) => {
			const result = await authService.loginAndSignTokens(jwt, body)
			if (!result.ok) {
				return status('Unauthorized', AUTH_ERRORS.INVALID_CREDENTIALS)
			}
			cookie[REFRESH_TOKEN].set({
				value: result.tokens.refreshToken,
				...COOKIE_OPTIONS,
			})
			return {
				user: result.user,
				tokens: { accessToken: result.tokens.accessToken },
			}
		},
		{
			body: LoginRequestSchema,
			response: { Unauthorized: AuthErrorSchema },
		},
	)
	.post(
		AUTH_ROUTES.refresh,
		async ({ jwt, status, cookie: { refreshToken: refreshCookie } }) => {
			const token = refreshCookie.value
			if (!token) {
				return status('Unauthorized', AUTH_ERRORS.INVALID_TOKEN)
			}
			const outcome = await authService.refreshTokens(jwt, token)
			if (!outcome.ok) {
				return status('Unauthorized', AUTH_ERRORS.INVALID_TOKEN)
			}
			refreshCookie.set({
				value: outcome.tokens.refreshToken,
				...COOKIE_OPTIONS,
			})
			return { tokens: { accessToken: outcome.tokens.accessToken } }
		},
		{
			cookie: t.Cookie({ refreshToken: t.Optional(t.String()) }),
			response: { Unauthorized: AuthErrorSchema },
		},
	)
	.post(
		AUTH_ROUTES.logout,
		async ({ cookie: { refreshToken: refreshCookie } }) => {
			await authService.logout(refreshCookie.value)
			refreshCookie.remove()
		},
		{ cookie: t.Cookie({ refreshToken: t.Optional(t.String()) }) },
	)
	.guard({ auth: true }, (app) =>
		app
			.get(
				AUTH_ROUTES.me,
				async ({ userId }) => {
					const user = await authService.getById(userId)
					return MeResponseSchema.parse(user)
				},
				{
					response: { Unauthorized: AuthErrorSchema },
				},
			)
			// Generates a short-lived one-time token for passwordless extension auth.
			// Requires a valid Bearer access token (user must be logged in on the web).
			.post(
				AUTH_ROUTES.extensionToken,
				async ({ userId }) => {
					const token = await authService.createExtensionToken(userId)
					return { token }
				},
				{
					response: { Unauthorized: AuthErrorSchema },
				},
			),
	)
	// Exchanges a one-time extension token for a JWT access + refresh token pair.
	// Returns tokens in the response body (not cookies) for extension storage.
	.post(
		AUTH_ROUTES.exchangeExtensionToken,
		async ({ body, jwt, status }) => {
			const tokens = await authService.exchangeExtensionToken(jwt, body.token)
			if (!tokens) {
				return status('Unauthorized', AUTH_ERRORS.INVALID_TOKEN)
			}
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
		AUTH_ROUTES.loginExtension,
		async ({ body, jwt, status }) => {
			const result = await authService.loginAndSignTokens(jwt, body)
			if (!result.ok) {
				return status('Unauthorized', AUTH_ERRORS.INVALID_CREDENTIALS)
			}
			return {
				accessToken: result.tokens.accessToken,
				refreshToken: result.tokens.refreshToken,
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
		AUTH_ROUTES.refreshExtension,
		async ({ body, jwt, status }) => {
			const outcome = await authService.refreshTokens(jwt, body.refreshToken)
			if (!outcome.ok) {
				return status('Unauthorized', AUTH_ERRORS.INVALID_TOKEN)
			}
			return {
				accessToken: outcome.tokens.accessToken,
				refreshToken: outcome.tokens.refreshToken,
			}
		},
		{
			body: ExtensionRefreshRequestSchema,
			response: { Unauthorized: AuthErrorSchema },
		},
	)
