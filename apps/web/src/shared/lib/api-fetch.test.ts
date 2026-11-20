import { afterEach, expect, spyOn, test } from 'bun:test'
import { API_PREFIX } from 'contracts'
import { WEB_CONFIG } from '@/shared/config/web-config'
import { apiFetch } from './api-fetch'
import { tokenStorage } from './token-storage'

const spies: { mockRestore(): void }[] = []
afterEach(() => {
	for (const spy of spies.splice(0)) spy.mockRestore()
})

test('calls the API with the access token', async () => {
	const fetch = spyOn(globalThis, 'fetch').mockResolvedValue(new Response('[]'))
	spies.push(
		fetch,
		spyOn(tokenStorage, 'getAccessToken').mockReturnValue('token'),
	)

	await apiFetch('/english-quiz/topics')

	const [url, init] = fetch.mock.calls[0] ?? []
	expect(String(url)).toBe(
		`${WEB_CONFIG.API_URL.replace(/\/$/, '')}${API_PREFIX}/english-quiz/topics`,
	)
	expect(new Headers(init?.headers).get('authorization')).toBe('Bearer token')
})
