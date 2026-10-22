import Soup from 'gi://Soup?version=3.0'
import { normalizeApiUrl } from '@/shared/urls'
import type {
	SessionStreamTransport,
	StreamConnection,
} from './session-stream.js'
import { SoupStreamConnection } from './soup-stream-connection.js'

/** Separate Soup session keeps stream liveness independent of JSON timeouts. */
export class SoupSessionStream implements SessionStreamTransport {
	private session = new Soup.Session({
		timeout: 45,
		user_agent: 'my-time-desktop/0.1.0',
	})
	private current: SoupStreamConnection | undefined
	private disposed = false
	private baseUrl: string

	constructor(baseUrl: string) {
		this.baseUrl = normalizeApiUrl(baseUrl)
	}

	async open(path: string, accessToken: string): Promise<StreamConnection> {
		if (this.disposed) throw new Error('Connection closed.')
		this.current?.close()
		const message = Soup.Message.new('GET', `${this.baseUrl}${path}`)
		if (!message) throw new Error('Invalid API URL.')
		message.set_flags(Soup.MessageFlags.NO_REDIRECT)
		message.request_headers.append('Accept', 'text/event-stream')
		message.request_headers.append('Authorization', `Bearer ${accessToken}`)
		const connection = new SoupStreamConnection(this.session, message)
		this.current = connection
		await connection.open()
		return connection
	}

	dispose(): void {
		this.disposed = true
		this.current?.close()
		this.current = undefined
		this.session.abort()
	}
}
