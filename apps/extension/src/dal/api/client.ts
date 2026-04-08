// DAL — generic authenticated fetch with automatic 401/refresh retry.
// Only this file is allowed to call fetch() directly.

import { getTokens, setTokens } from '@/dal/storage/tokenRepository'
import { EXTENSION_CONFIG } from '@/shared/config/extension-config'

const API_BASE = EXTENSION_CONFIG.API_URL

export async function apiFetch<T>(
	path: string,
	options: RequestInit = {},
): Promise<{ data: T | null; error: string | null }> {
	const tokens = await getTokens()
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>),
	}
	if (tokens?.accessToken) {
		headers.Authorization = `Bearer ${tokens.accessToken}`
	}

	const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

	// Attempt token refresh on 401
	if (res.status === 401 && tokens?.refreshToken) {
		const refreshRes = await fetch(`${API_BASE}/auth/refresh-extension`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken: tokens.refreshToken }),
		})
		if (refreshRes.ok) {
			const refreshed = (await refreshRes.json()) as {
				accessToken: string
				refreshToken: string
			}
			await setTokens(refreshed.accessToken, refreshed.refreshToken)
			headers.Authorization = `Bearer ${refreshed.accessToken}`
			const retried = await fetch(`${API_BASE}${path}`, { ...options, headers })
			if (!retried.ok) return { data: null, error: `HTTP ${retried.status}` }
			return { data: (await retried.json()) as T, error: null }
		}
		return { data: null, error: 'Unauthorized' }
	}

	if (!res.ok) return { data: null, error: `HTTP ${res.status}` }
	if (res.status === 204) return { data: null, error: null }
	return { data: (await res.json()) as T, error: null }
}

/** One-off unauthenticated POST — used for token exchange which has no bearer token yet. */
export async function publicPost<T>(
	path: string,
	body: unknown,
): Promise<{ data: T | null; error: string | null }> {
	const res = await fetch(`${API_BASE}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
	if (!res.ok) return { data: null, error: `HTTP ${res.status}` }
	return { data: (await res.json()) as T, error: null }
}
