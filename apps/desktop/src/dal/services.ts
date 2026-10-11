import { ApiClient } from './api-client.js'
import { BrowserLogin } from './browser-login'
import { SoupTransport } from './http-transport.js'
import { RetryDelay } from './retry-delay'
import { SoupSessionStream } from './soup-session-stream.js'
import { KeyringTokenStore } from './token-store.js'

export function createTokenStore(server: string): KeyringTokenStore {
	return new KeyringTokenStore(server)
}
export function createApiClient(server: string): ApiClient {
	return new ApiClient(
		new SoupTransport(server),
		createTokenStore(server),
		new SoupSessionStream(server),
	)
}

export function createBrowserLogin(server: string): BrowserLogin {
	return new BrowserLogin(
		new SoupTransport(server),
		createTokenStore(server),
		new RetryDelay(),
	)
}
