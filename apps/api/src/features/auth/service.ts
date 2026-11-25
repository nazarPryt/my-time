import { createHash } from 'node:crypto'
import type { users } from '@db/schema'
import type {
	LoginRequest,
	MeResponse,
	RegisterRequest,
} from '@my-time/contracts'
import { MeResponseSchema } from '@my-time/contracts'
import { logger } from '@shared/logger'
import { authEventsTotal } from '@shared/metrics'
import { EXTENSION_TOKEN_TTL_MS } from './constants'
import {
	authRepository,
	extensionTokenRepository,
	refreshTokenRepository,
} from './repository'
import { getUserIdFromToken, type JwtHandle, signTokenPair } from './token'

/** Correlates repeated failures for one account without logging the email. */
function hashEmail(email: string): string {
	return createHash('sha256')
		.update(email.trim().toLowerCase())
		.digest('hex')
		.slice(0, 12)
}

export type TokenPair = { accessToken: string; refreshToken: string }

export type RefreshResult = { ok: true; tokens: TokenPair } | { ok: false }

export type LoginResult =
	| { ok: true; user: MeResponse; tokens: TokenPair }
	| { ok: false }

function toPublicUser(u: typeof users.$inferSelect) {
	const { passwordHash: _, createdAt: __, updatedAt: ___, ...pub } = u
	return MeResponseSchema.parse(pub)
}

/** Signs a fresh access/refresh pair and persists the refresh token. */
async function signAndSaveTokens(
	jwt: JwtHandle,
	userId: string,
): Promise<TokenPair> {
	const { accessToken, refreshToken, refreshExpiresAt } = await signTokenPair(
		jwt,
		userId,
	)
	await refreshTokenRepository.save(refreshToken, userId, refreshExpiresAt)
	return { accessToken, refreshToken }
}

// Unknown = already used/expired/never issued (e.g. a reused token after rotation).
function refreshFailed(reason: 'unknown-token' | 'invalid-token'): {
	ok: false
} {
	authEventsTotal.inc({ event: 'refresh_failed' })
	logger.warn({ reason }, 'token refresh failed')
	return { ok: false }
}

export const authService = {
	register: async (data: RegisterRequest) => {
		const existing = await authRepository.findByEmail(data.email)
		if (existing) throw new Error('EMAIL_TAKEN')

		const passwordHash = await Bun.password.hash(data.password)
		const user = await authRepository.create({
			email: data.email,
			name: data.name,
			passwordHash,
		})

		authEventsTotal.inc({ event: 'register' })
		logger.info({ userId: user.id }, 'user registered')

		return toPublicUser(user)
	},

	login: async ({ email, password }: LoginRequest) => {
		const user = await authRepository.findByEmail(email)
		if (!user) throw new Error('INVALID_CREDENTIALS')

		const valid = await Bun.password.verify(password, user.passwordHash)
		if (!valid) throw new Error('INVALID_CREDENTIALS')

		authEventsTotal.inc({ event: 'login' })
		logger.info({ userId: user.id }, 'user logged in')

		return toPublicUser(user)
	},

	getById: async (id: string) => {
		const user = await authRepository.findById(id)
		if (!user) throw new Error('NOT_FOUND')
		return toPublicUser(user)
	},

	signAndSaveTokens,

	/**
	 * Authenticates the user and issues a token pair. Only a credentials
	 * failure is reported as {ok: false} — any other error (e.g. a DB failure
	 * while persisting the refresh token) propagates, since it isn't the
	 * user's fault and shouldn't be reported as "invalid credentials".
	 */
	loginAndSignTokens: async (
		jwt: JwtHandle,
		body: LoginRequest,
	): Promise<LoginResult> => {
		let user: MeResponse
		try {
			user = await authService.login(body)
		} catch (e: unknown) {
			if (e instanceof Error && e.message === 'INVALID_CREDENTIALS') {
				authEventsTotal.inc({ event: 'login_failed' })
				logger.warn({ emailHash: hashEmail(body.email) }, 'login failed')
				return { ok: false }
			}
			throw e
		}
		const tokens = await signAndSaveTokens(jwt, user.id)
		return { ok: true, user, tokens }
	},

	/**
	 * Atomically consumes a refresh token and mints a fresh pair. The token is
	 * deleted before it's verified — this is deliberate: it's what makes the
	 * token single-use even under two concurrent requests racing on it.
	 */
	refreshTokens: async (
		jwt: JwtHandle,
		rawToken: string,
	): Promise<RefreshResult> => {
		const consumed = await refreshTokenRepository.consume(rawToken)
		if (!consumed) return refreshFailed('unknown-token')

		const userId = await getUserIdFromToken(jwt, rawToken)
		if (!userId) return refreshFailed('invalid-token')

		const tokens = await signAndSaveTokens(jwt, userId)
		authEventsTotal.inc({ event: 'refresh' })
		return { ok: true, tokens }
	},

	logout: async (rawToken: string | undefined): Promise<void> => {
		if (rawToken) await refreshTokenRepository.remove(rawToken)
		authEventsTotal.inc({ event: 'logout' })
		logger.info('user logged out')
	},

	/** One-time token for passwordless extension login — see AUTH_ROUTES.extensionToken. */
	createExtensionToken: async (userId: string): Promise<string> => {
		const expiresAt = new Date(Date.now() + EXTENSION_TOKEN_TTL_MS)
		const row = await extensionTokenRepository.create(userId, expiresAt)
		return row.token
	},

	exchangeExtensionToken: async (
		jwt: JwtHandle,
		rawToken: string,
	): Promise<TokenPair | null> => {
		const consumed = await extensionTokenRepository.consume(rawToken)
		if (!consumed) {
			logger.warn('extension token exchange failed')
			return null
		}
		return signAndSaveTokens(jwt, consumed.userId)
	},
}
