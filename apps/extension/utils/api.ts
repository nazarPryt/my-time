import { getTokens, setTokens } from './auth'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'

async function apiFetch<T>(
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

	// Try token refresh on 401
	if (res.status === 401 && tokens?.refreshToken) {
		const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken: tokens.refreshToken }),
		})
		if (refreshRes.ok) {
			const refreshed = await refreshRes.json()
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

export interface LoginResult {
	accessToken: string
	refreshToken: string
}

export async function login(
	email: string,
	password: string,
): Promise<{ data: LoginResult | null; error: string | null }> {
	return apiFetch<LoginResult>('/auth/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
	})
}

export interface BlockedSite {
	id: string
	domain: string
	createdAt: string
}

export async function fetchBlockedSites(): Promise<{
	data: BlockedSite[] | null
	error: string | null
}> {
	return apiFetch<BlockedSite[]>('/site-blocking')
}
