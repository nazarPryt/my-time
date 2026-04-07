const STORAGE_KEY = 'my_time_tokens'

interface Tokens {
	accessToken: string
	refreshToken: string
}

export async function getTokens(): Promise<Tokens | null> {
	const result = await browser.storage.local.get(STORAGE_KEY)
	return (result[STORAGE_KEY] as Tokens) ?? null
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
