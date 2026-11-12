// DAL — sole owner of chrome.storage.local for auth tokens.

const STORAGE_KEY = 'my_time_tokens'

export interface StoredTokens {
	accessToken: string
	refreshToken: string
}

export async function getTokens(): Promise<StoredTokens | null> {
	const result = await browser.storage.local.get(STORAGE_KEY)
	return (result[STORAGE_KEY] as StoredTokens) ?? null
}

export async function setTokens(
	accessToken: string,
	refreshToken: string,
): Promise<void> {
	await browser.storage.local.set({
		[STORAGE_KEY]: { accessToken, refreshToken },
	})
}

export async function clearTokens(): Promise<void> {
	await browser.storage.local.remove(STORAGE_KEY)
}
