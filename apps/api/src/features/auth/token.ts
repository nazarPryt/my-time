import { refreshTokenRepository } from './repository'

const ACCESS_TOKEN_TTL_SECONDS = 5 * 60 // 15 minutes
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60 // 7 days

type JwtSigner = { sign: (payload: Record<string, unknown>) => Promise<string> }

export async function generateTokens(jwt: JwtSigner, userId: string) {
	const now = Math.floor(Date.now() / 1000)
	const accessToken = await jwt.sign({
		sub: userId,
		exp: now + ACCESS_TOKEN_TTL_SECONDS,
		jti: crypto.randomUUID(),
	})
	const refreshExpiresAt = new Date((now + REFRESH_TOKEN_TTL_SECONDS) * 1000)
	const refreshToken = await jwt.sign({
		sub: userId,
		exp: now + REFRESH_TOKEN_TTL_SECONDS,
		jti: crypto.randomUUID(),
	})
	await refreshTokenRepository.save(refreshToken, userId, refreshExpiresAt)
	return { accessToken, refreshToken }
}
