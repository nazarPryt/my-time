import { treaty } from '@elysiajs/eden'
import type { App } from 'api'
import { MOBILE_CONFIG } from '@/shared/config/mobile-config'
import { createAuthFetch } from './auth-fetch'
import { tokenStorage } from './token-storage'

const client = treaty<App>(MOBILE_CONFIG.API_URL, {
	fetcher: createAuthFetch(),
	async headers() {
		const token = await tokenStorage.get()
		return token ? { authorization: `Bearer ${token}` } : {}
	},
})

export const api = client.api.v1
