import { API_PREFIX } from 'contracts'
import { INTEGRATION_API_URL } from '../../../scripts/e2e-integration-config'
import { ConnectionError, type HttpTransport } from '../src/dal/api-client'
import type { SessionStreamTransport } from '../src/dal/session-stream'

/** Transport fault injection; successful requests always reach the real API. */
export class OfflineTestTransport
	implements HttpTransport, SessionStreamTransport
{
	online = true
	loseNextSyncResponse = false
	committedUploads = 0
	private requests = new AbortController()
	private stream = new AbortController()
	setOnline(online: boolean): void {
		this.online = online
		if (!online) this.stream.abort()
	}
	private requireOnline(): void {
		if (!this.online)
			throw new ConnectionError('Integration desktop is offline.')
	}
	async send(
		method: string,
		path: string,
		body?: unknown,
		accessToken?: string,
	) {
		this.requireOnline()
		const response = await fetch(`${INTEGRATION_API_URL}${API_PREFIX}${path}`, {
			method,
			signal: this.requests.signal,
			headers: {
				'Content-Type': 'application/json',
				...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
			},
			body: body === undefined ? undefined : JSON.stringify(body),
		})
		const value: unknown = await response.json()
		if (path.endsWith('/offline/sync') && response.ok) {
			this.committedUploads++
			if (this.loseNextSyncResponse) {
				this.loseNextSyncResponse = false
				this.setOnline(false)
				throw new ConnectionError(
					'Upload committed, but its response was lost.',
				)
			}
		}
		return { status: response.status, body: value }
	}
	async open(path: string, accessToken: string) {
		this.requireOnline()
		this.stream = new AbortController()
		const response = await fetch(`${INTEGRATION_API_URL}${API_PREFIX}${path}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'User-Agent': 'my-time-desktop/offline-integration',
			},
			signal: this.stream.signal,
		})
		const reader = response.body?.getReader()
		return {
			status: response.status,
			contentType: response.headers.get('content-type') ?? '',
			read: async () => {
				const value = await reader?.read()
				return value?.done ? null : (value?.value ?? null)
			},
			close: () => {
				void reader?.cancel().catch(() => {})
			},
		}
	}
	dispose(): void {
		this.requests.abort()
		this.stream.abort()
	}
}
