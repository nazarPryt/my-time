import { API_PREFIX, AUTH_ROUTES } from 'contracts'
import { WEB_CONFIG } from '@/shared/config/web-config'
import {
	type FetchResponse,
	fetchJsonResponse,
	fetchStreamResponse,
} from './fetch-response'
import { refreshAccessToken } from './refresh-access-token'
import { tokenStorage } from './token-storage'

const AUTH_PREFIX = `${API_PREFIX}${AUTH_ROUTES.prefix}`
const PUBLIC_AUTH_PATHS = new Set(
	[AUTH_ROUTES.refresh, AUTH_ROUTES.login, AUTH_ROUTES.register].map(
		(path) => `${AUTH_PREFIX}${path}`,
	),
)

function requestHeaders(input: RequestInfo | URL, init?: RequestInit): Headers {
	return new Headers(
		init?.headers ?? (input instanceof Request ? input.headers : undefined),
	)
}

function requestSignal(
	input: RequestInfo | URL,
	init?: RequestInit,
): AbortSignal | undefined {
	return init?.signal ?? (input instanceof Request ? input.signal : undefined)
}

async function authenticatedFetch(
	input: RequestInfo | URL,
	init: RequestInit | undefined,
	send: FetchResponse,
): Promise<Response> {
	const response = await send(input, init)
	if (response.status !== 401) return response
	const url = input instanceof Request ? input.url : input.toString()
	if (PUBLIC_AUTH_PATHS.has(new URL(url, WEB_CONFIG.API_URL).pathname))
		return response
	const signal = requestSignal(input, init)
	if (signal?.aborted) return response

	const headers = requestHeaders(input, init)
	const token = tokenStorage.getAccessToken()
	const alreadyRotated =
		token && headers.get('authorization') !== `Bearer ${token}`
	try {
		if (!alreadyRotated && !(await refreshAccessToken())) return response
	} catch (error) {
		await response.body?.cancel()
		throw error
	}
	await response.body?.cancel()
	signal?.throwIfAborted()
	const refreshedToken = tokenStorage.getAccessToken()
	if (!refreshedToken) return response
	headers.set('authorization', `Bearer ${refreshedToken}`)
	return send(input, { ...init, headers })
}

export function fetchWithRefresh(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<Response> {
	return authenticatedFetch(input, init, fetchJsonResponse)
}

export function fetchStreamWithRefresh(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<Response> {
	return authenticatedFetch(input, init, fetchStreamResponse)
}
