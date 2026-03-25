import { RefreshResponseSchema } from 'contracts'
import { WEB_CONFIG } from '@/shared/config/web-config'
import { tokenStorage } from './token-storage'

const TIMEOUT_MS = 15_000

function timeoutSignal(existing?: AbortSignal | null): AbortSignal {
	const timeout = AbortSignal.timeout(TIMEOUT_MS)
	return existing ? AbortSignal.any([existing, timeout]) : timeout
}

// Shared promise so concurrent 401s trigger only one refresh call
let refreshPromise: Promise<boolean> | null = null

async function refreshTokens(): Promise<boolean> {
	const response = await fetch(`${WEB_CONFIG.API_URL}/api/v1/auth/refresh`, {
		method: 'POST',
		credentials: 'include',
		signal: AbortSignal.timeout(TIMEOUT_MS),
	})

	if (!response.ok) {
		tokenStorage.clear()
		return false
	}

	const raw = await response.json()
	const data = RefreshResponseSchema.parse(raw)
	tokenStorage.setAccessToken(data.tokens.accessToken)
	return true
}

export async function fetchWithRefresh(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<Response> {
	const response = await fetch(input, {
		...init,
		credentials: 'include',
		signal: timeoutSignal(init?.signal),
	})

	if (response.status !== 401) return response

	// Don't intercept the refresh endpoint itself — would cause infinite loop
	const url = input instanceof Request ? input.url : input.toString()
	if (url.includes('/auth/refresh')) return response

	// Deduplicate: reuse in-flight refresh if one is already running
	refreshPromise ??= refreshTokens()
		.catch(() => false)
		.finally(() => {
			refreshPromise = null
		})
	const refreshed = await refreshPromise

	if (!refreshed) return response

	// Retry original request with the new access token
	const newToken = tokenStorage.getAccessToken()
	return fetch(input, {
		...init,
		credentials: 'include',
		headers: { ...init?.headers, authorization: `Bearer ${newToken}` },
		signal: timeoutSignal(init?.signal),
	})
}
