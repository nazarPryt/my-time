import { treaty } from '@elysiajs/eden'
import type { App } from 'api'
import { tokenStorage } from './token-storage'

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

const client = treaty<App>(API_URL, {
  async headers() {
    const token = await tokenStorage.get()
    return token ? { authorization: `Bearer ${token}` } : {}
  },
})

export const api = client.api.v1