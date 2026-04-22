import { API_PREFIX, AUTH_ROUTES } from 'contracts'
import { router } from 'expo-router'
import { MOBILE_CONFIG } from '@/shared/config/mobile-config'
import { tokenStorage } from './token-storage'

const { API_URL } = MOBILE_CONFIG
const REFRESH_URL = `${API_URL}${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.refreshExtension}`

let refreshPromise: Promise<string> | null = null

async function doRefresh(): Promise<string> {
	const refreshToken = await tokenStorage.getRefreshToken()
	if (!refreshToken) {
		await tokenStorage.clear()
		router.replace('/(auth)/login')
		throw new Error('No refresh token')
	}

	const refreshResponse = await fetch(REFRESH_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ refreshToken }),
	})

	if (!refreshResponse.ok) {
		await tokenStorage.clear()
		router.replace('/(auth)/login')
		throw new Error('Refresh failed')
	}

	let tokens: { accessToken: string; refreshToken: string }
	try {
		tokens = await refreshResponse.json()
	} catch {
		await tokenStorage.clear()
		router.replace('/(auth)/login')
		throw new Error('Invalid refresh response')
	}

	if (!tokens.accessToken || !tokens.refreshToken) {
		await tokenStorage.clear()
		router.replace('/(auth)/login')
		throw new Error('Missing tokens in refresh response')
	}

	await tokenStorage.save(tokens.accessToken)
	await tokenStorage.saveRefreshToken(tokens.refreshToken)
	return tokens.accessToken
}

export function createAuthFetch(): typeof fetch {
	return async (input, init) => {
		const response = await fetch(input, init)

		if (response.status !== 401) return response

		if (!refreshPromise) {
			refreshPromise = doRefresh().finally(() => {
				refreshPromise = null
			})
		}

		const newAccessToken = await refreshPromise.catch(() => null)
		if (!newAccessToken) return response

		// Retry the original request with the new access token
		if (input instanceof Request) {
			const retryHeaders = new Headers(input.headers)
			retryHeaders.set('authorization', `Bearer ${newAccessToken}`)
			return fetch(new Request(input, { headers: retryHeaders }))
		}
		const retryHeaders = new Headers(
			(init?.headers as HeadersInit | undefined) ?? {},
		)
		retryHeaders.set('authorization', `Bearer ${newAccessToken}`)
		return fetch(input, { ...init, headers: retryHeaders })
	}
}
