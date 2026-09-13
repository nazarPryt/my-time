const ACCESS_TOKEN_TTL_SECONDS = 15 * 60 // 15 minutes
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60 // 7 days

export type JwtHandle = {
	sign: (payload: { sub: string; exp: number; jti: string }) => Promise<string>
	verify: (token: string) => Promise<false | Record<string, unknown>>
}

export type SignedTokenPair = {
	accessToken: string
	refreshToken: string
	refreshExpiresAt: Date
}

/**
 * Pure JWT signing — no persistence. Callers decide whether/how to store the
 * refresh token (see authService.signAndSaveTokens, the only place that does).
 */
export async function signTokenPair(
	jwt: JwtHandle,
	userId: string,
): Promise<SignedTokenPair> {
	const now = Math.floor(Date.now() / 1000)
	const refreshExpiresAt = new Date((now + REFRESH_TOKEN_TTL_SECONDS) * 1000)
	const [accessToken, refreshToken] = await Promise.all([
		jwt.sign({
			sub: userId,
			exp: now + ACCESS_TOKEN_TTL_SECONDS,
			jti: crypto.randomUUID(),
		}),
		jwt.sign({
			sub: userId,
			exp: now + REFRESH_TOKEN_TTL_SECONDS,
			jti: crypto.randomUUID(),
		}),
	])
	return { accessToken, refreshToken, refreshExpiresAt }
}

/** Verifies a JWT and returns its subject (userId), or null if invalid/malformed. */
export async function getUserIdFromToken(
	jwt: JwtHandle,
	token: string,
): Promise<string | null> {
	const payload = await jwt.verify(token)
	if (!payload || typeof payload.sub !== 'string') return null
	return payload.sub
}
