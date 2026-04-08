// BLL — auth business logic.
// Only calls DAL functions; never touches fetch() or chrome.storage directly.

import type { LoginRequest } from 'contracts'
import { exchangeExtensionTokenRequest, loginRequest } from '@/dal/api/authApi'
import {
	clearTokens,
	getTokens,
	setTokens,
} from '@/dal/storage/tokenRepository'

export async function isAuthenticated(): Promise<boolean> {
	const tokens = await getTokens()
	return tokens !== null
}

export async function login(
	credentials: LoginRequest,
): Promise<{ success: boolean; error: string | null }> {
	const { data, error } = await loginRequest(credentials)
	if (error || !data) {
		return { success: false, error: error ?? 'Login failed' }
	}
	await setTokens(data.accessToken, data.refreshToken)
	return { success: true, error: null }
}

export async function logout(): Promise<void> {
	await clearTokens()
}

export async function exchangeToken(
	token: string,
): Promise<{ success: boolean }> {
	const { data, error } = await exchangeExtensionTokenRequest(token)
	if (error || !data) return { success: false }
	await setTokens(data.accessToken, data.refreshToken)
	return { success: true }
}
