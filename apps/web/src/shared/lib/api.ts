import { treaty } from '@elysiajs/eden'
import type { App } from '@my-time/api'
import { WEB_CONFIG } from '@/shared/config/web-config'
import { fetchWithRefresh } from './fetch-with-refresh'
import { tokenStorage } from './token-storage'

const client = treaty<App>(WEB_CONFIG.API_URL, {
	headers() {
		const token = tokenStorage.getAccessToken()
		return token ? { authorization: `Bearer ${token}` } : {}
	},
	fetcher: fetchWithRefresh,
})
export const api = client.api.v1
