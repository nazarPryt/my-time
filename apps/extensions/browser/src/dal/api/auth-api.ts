// DAL — all auth-related HTTP calls.

import type { ExchangeExtensionTokenResponse, LoginRequest } from 'contracts'
import { apiFetch, publicPost } from './client'

export interface LoginTokens {
	accessToken: string
	refreshToken: string
}

export async function loginRequest(
	body: LoginRequest,
): Promise<{ data: LoginTokens | null; error: string | null }> {
	return apiFetch<LoginTokens>('/auth/login-extension', {
		method: 'POST',
		body: JSON.stringify(body),
	})
}

export async function exchangeExtensionTokenRequest(token: string): Promise<{
	data: ExchangeExtensionTokenResponse | null
	error: string | null
}> {
	return publicPost<ExchangeExtensionTokenResponse>(
		'/auth/exchange-extension-token',
		{ token },
	)
}
