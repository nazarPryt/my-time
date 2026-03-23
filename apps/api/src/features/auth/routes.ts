import { jwt } from '@elysiajs/jwt'
import { API_CONFIG } from '@shared/api-config'
import { Elysia, t } from 'elysia'
import {
	AuthResponseSchema,
	LoginRequestSchema,
	LogoutRequestSchema,
	MeResponseSchema,
	RefreshRequestSchema,
	RegisterRequestSchema,
} from 'contracts'
import { refreshTokenRepository } from './repository'
import { authService } from './service'
import { generateTokens } from './token'

const jwtPlugin = jwt({
	name: 'jwt',
	secret: API_CONFIG.JWT_SECRET,
})

const AuthErrorSchema = t.Object({ code: t.String(), message: t.String() })

export const authPlugin = new Elysia({ prefix: '/auth' })
	.use(jwtPlugin)
	.post(
		'/register',
		async ({ body, jwt, status }) => {
			try {
				const user = await authService.register(body)
				const tokens = await generateTokens(jwt, user.id)
				return AuthResponseSchema.parse({ user, tokens })
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
		async ({ body, jwt, status }) => {
			try {
				const user = await authService.login(body)
				const tokens = await generateTokens(jwt, user.id)
				return { user, tokens }
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
		async ({ body, jwt, status }) => {
			const valid = await refreshTokenRepository.exists(body.refreshToken)
			if (!valid) {
				return status('Unauthorized', {
					code: 'INVALID_TOKEN',
					message: 'Refresh token invalid or expired',
				})
			}
			const payload = await jwt.verify(body.refreshToken)
			if (!payload || typeof payload.sub !== 'string') {
				return status('Unauthorized', {
					code: 'INVALID_TOKEN',
					message: 'Refresh token invalid or expired',
				})
			}
			await refreshTokenRepository.remove(body.refreshToken)
			const tokens = await generateTokens(jwt, payload.sub)
			return { tokens }
		},
		{
			body: RefreshRequestSchema,
			response: { Unauthorized: AuthErrorSchema },
		},
	)
	.post(
		'/logout',
		async ({ body }) => {
			await refreshTokenRepository.remove(body.refreshToken)
		},
		{ body: LogoutRequestSchema },
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
