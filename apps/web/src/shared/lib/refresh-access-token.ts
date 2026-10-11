import { API_PREFIX, AUTH_ROUTES, RefreshResponseSchema } from 'contracts'
import { WEB_CONFIG } from '@/shared/config/web-config'
import { fetchJsonResponse } from './fetch-response'
import { tokenStorage } from './token-storage'

const REFRESH_URL = `${WEB_CONFIG.API_URL}${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.refresh}`
let refreshPromise: Promise<boolean> | undefined

async function rotateAccessToken(): Promise<boolean> {
	const previous = tokenStorage.getAccessToken()
	const response = await fetchJsonResponse(REFRESH_URL, { method: 'POST' })
	// A sign-out or another account's sign-in must supersede this refresh.
	if (tokenStorage.getAccessToken() !== previous)
		return tokenStorage.getAccessToken() !== null
	if (response.status === 401 || response.status === 403) {
		tokenStorage.clear()
		return false
	}
	if (!response.ok)
		throw new Error(`Token refresh failed: HTTP ${response.status}`)
	const data = RefreshResponseSchema.parse(await response.json())
	if (tokenStorage.getAccessToken() !== previous)
		return tokenStorage.getAccessToken() !== null
	tokenStorage.setAccessToken(data.tokens.accessToken)
	return true
}

export function refreshAccessToken(): Promise<boolean> {
	refreshPromise ??= rotateAccessToken().finally(() => {
		refreshPromise = undefined
	})
	return refreshPromise
}
