import { ApiClient } from './api-client.js'
import { SoupTransport } from './http-transport.js'
import { KeyringTokenStore } from './token-store.js'

export function createTokenStore(server: string): KeyringTokenStore {
	return new KeyringTokenStore(server)
}
export function createApiClient(server: string): ApiClient {
	return new ApiClient(new SoupTransport(server), createTokenStore(server))
}
