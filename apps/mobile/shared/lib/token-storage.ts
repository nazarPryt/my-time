import * as SecureStore from 'expo-secure-store'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const tokenStorage = {
	async save(accessToken: string): Promise<void> {
		await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken)
	},

	async get(): Promise<string | null> {
		return SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
	},

	async saveRefreshToken(refreshToken: string): Promise<void> {
		await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken)
	},

	async getRefreshToken(): Promise<string | null> {
		return SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
	},

	async clearRefreshToken(): Promise<void> {
		await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
	},

	async clear(): Promise<void> {
		await Promise.all([
			SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
			SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
		])
	},
}
