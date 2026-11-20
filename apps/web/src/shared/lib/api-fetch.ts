import { API_PREFIX } from '@my-time/contracts'
import type { RemoteApiFetch } from '@my-time/micro-frontends'
import { WEB_CONFIG } from '@/shared/config/web-config'
import { fetchWithRefresh } from './fetch-with-refresh'
import { tokenStorage } from './token-storage'

/** Authenticated fetch handed to micro frontends; `path` follows API_PREFIX. */
export const apiFetch: RemoteApiFetch = (path, init) => {
	const headers = new Headers(init?.headers)
	const token = tokenStorage.getAccessToken()
	if (token) headers.set('authorization', `Bearer ${token}`)
	const url = `${WEB_CONFIG.API_URL.replace(/\/$/, '')}${API_PREFIX}${path}`
	return fetchWithRefresh(url, { ...init, headers })
}
