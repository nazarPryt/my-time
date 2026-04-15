import * as SecureStore from 'expo-secure-store'

const ACCESS_TOKEN_KEY = 'access_token'

export const tokenStorage = {
  async save(accessToken: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken)
  },

  async get(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
  },

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)
  },
}