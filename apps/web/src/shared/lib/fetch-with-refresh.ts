import { WEB_CONFIG } from '@/shared/config/web-config'
import { tokenStorage } from './token-storage'

// Shared promise so concurrent 401s trigger only one refresh call
let refreshPromise: Promise<boolean> | null = null

async function refreshTokens(): Promise<boolean> {
	const refreshToken = tokenStorage.getRefreshToken()
	if (!refreshToken) return false

	const response = await fetch(`${WEB_CONFIG.API_URL}/api/v1/auth/refresh`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ refreshToken }),
	})

	if (!response.ok) {
		tokenStorage.clear()
		return false
	}

	const data = await response.json()
	tokenStorage.setTokens(data.tokens.accessToken, data.tokens.refreshToken)
	return true
}

export async function fetchWithRefresh(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<Response> {
	const response = await fetch(input, init)

	if (response.status !== 401) return response

	// Don't intercept the refresh endpoint itself — would cause infinite loop
	const url = input instanceof Request ? input.url : input.toString()
	if (url.includes('/auth/refresh')) return response

	// Deduplicate: reuse in-flight refresh if one is already running
	refreshPromise ??= refreshTokens().finally(() => {
		refreshPromise = null
	})
	const refreshed = await refreshPromise

	if (!refreshed) return response

	// Retry original request with the new access token
	const newToken = tokenStorage.getAccessToken()
	return fetch(input, {
		...init,
		headers: { ...init?.headers, authorization: `Bearer ${newToken}` },
	})
}
