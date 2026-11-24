import type { Page } from '@playwright/test'
import { ACCESS_TOKEN_KEY } from '@/shared/lib/token-storage'

export function readAccessToken(page: Page) {
	return page.evaluate((key) => localStorage.getItem(key), ACCESS_TOKEN_KEY)
}

/** Stores the token before the app first boots; later loads keep whatever the app left. */
export async function seedAccessToken(page: Page, token: string) {
	await page.addInitScript(
		([key, value]) => {
			if (sessionStorage.getItem('e2e-token-seeded')) return
			sessionStorage.setItem('e2e-token-seeded', '1')
			localStorage.setItem(key, value)
		},
		[ACCESS_TOKEN_KEY, token] as const,
	)
}
