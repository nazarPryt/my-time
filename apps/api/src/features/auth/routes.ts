import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import {
	LoginRequestSchema,
	LogoutRequestSchema,
	RefreshRequestSchema,
	RegisterRequestSchema,
} from './schemas'
import { authService } from './service'
import { refreshTokenRepository } from './repository'
import { API_CONFIG } from '@shared/api-config'

const jwtPlugin = jwt({
	name: 'jwt',
	secret: API_CONFIG.JWT_SECRET,
})

const AuthErrorSchema = t.Object({ code: t.String(), message: t.String() })

type JwtSigner = { sign: (payload: Record<string, unknown>) => Promise<string> }

async function generateTokens(jwt: JwtSigner, userId: string) {
	const now = Math.floor(Date.now() / 1000)
	const accessToken = await jwt.sign({ sub: userId, exp: now + 15 * 60 })
	const refreshExpiresAt = new Date((now + 7 * 24 * 60 * 60) * 1000)
	const refreshToken = await jwt.sign({ sub: userId, exp: now + 7 * 24 * 60 * 60 })
	await refreshTokenRepository.save(refreshToken, userId, refreshExpiresAt)
	return { accessToken, refreshToken }
}

export const authPlugin = new Elysia({ prefix: '/auth' })
	.use(jwtPlugin)
	.post(
		'/register',
		async ({ body, jwt, status }) => {
			try {
				const user = await authService.register(body)
				const tokens = await generateTokens(jwt, user.id)
				return { user, tokens }
			} catch (e: unknown) {
				if (e instanceof Error && e.message === 'EMAIL_TAKEN') {
					return status('Conflict', { code: 'EMAIL_TAKEN', message: 'Email already registered' })
				}
				throw e
			}
		},
		{
			body: RegisterRequestSchema,
			response: { 409: AuthErrorSchema },
		},
	)
	.post(
		'/login',
		async ({ body, jwt, status }) => {
			try {
				const user = await authService.login(body.email, body.password)
				const tokens = await generateTokens(jwt, user.id)
				return { user, tokens }
			} catch {
				return status('Unauthorized', { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' })
			}
		},
		{
			body: LoginRequestSchema,
			response: { 401: AuthErrorSchema },
		},
	)
	.post(
		'/refresh',
		async ({ body, jwt, status }) => {
			const valid = await refreshTokenRepository.exists(body.refreshToken)
			if (!valid) {
				return status('Unauthorized', { code: 'INVALID_TOKEN', message: 'Refresh token invalid or expired' })
			}
			const payload = await jwt.verify(body.refreshToken)
			if (!payload || typeof payload.sub !== 'string') {
				return status('Unauthorized', { code: 'INVALID_TOKEN', message: 'Refresh token invalid or expired' })
			}
			await refreshTokenRepository.remove(body.refreshToken)
			const tokens = await generateTokens(jwt, payload.sub)
			return { tokens }
		},
		{
			body: RefreshRequestSchema,
			response: { 401: AuthErrorSchema },
		},
	)
	.post(
		'/logout',
		async ({ body }) => {
			await refreshTokenRepository.remove(body.refreshToken)
		},
		{ body: LogoutRequestSchema },
	)
	.get('/me', async ({ headers, jwt, status }) => {
		const auth = headers.authorization
		if (!auth?.startsWith('Bearer ')) {
			return status('Unauthorized', { code: 'UNAUTHORIZED', message: 'Missing token' })
		}
		const payload = await jwt.verify(auth.slice(7))
		if (!payload || typeof payload.sub !== 'string') {
			return status('Unauthorized', { code: 'UNAUTHORIZED', message: 'Invalid token' })
		}
		const user = await authService.getById(payload.sub)
		return { user }
	}, {
		response: { 401: AuthErrorSchema },
	})