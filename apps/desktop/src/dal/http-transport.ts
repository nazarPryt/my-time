import Gio from 'gi://Gio'
import GLib from 'gi://GLib'
import Soup from 'gi://Soup?version=3.0'
import { normalizeApiUrl } from '@/shared/urls'
import type { HttpResponse, HttpTransport } from './api-client.js'
import { ConnectionError } from './api-client.js'

export class SoupTransport implements HttpTransport {
	private session = new Soup.Session({
		timeout: 15,
		user_agent: 'my-time-desktop/0.1.0',
	})
	private cancellable = new Gio.Cancellable()
	private baseUrl: string

	constructor(baseUrl: string) {
		this.baseUrl = normalizeApiUrl(baseUrl)
	}

	send(
		method: string,
		path: string,
		body?: unknown,
		accessToken?: string,
	): Promise<HttpResponse> {
		return new Promise((resolve, reject) => {
			if (this.cancellable.is_cancelled())
				return reject(new Error('Connection closed.'))
			const message = Soup.Message.new(method, `${this.baseUrl}${path}`)
			if (!message)
				return reject(new Error('Invalid API URL. Open Settings to reconnect.'))
			// Keep credentials on the configured endpoint; redirected logins need an explicit URL.
			message.set_flags(Soup.MessageFlags.NO_REDIRECT)
			message.request_headers.append('Accept', 'application/json')
			if (accessToken)
				message.request_headers.append('Authorization', `Bearer ${accessToken}`)
			if (body !== undefined) {
				message.set_request_body_from_bytes(
					'application/json',
					new GLib.Bytes(new TextEncoder().encode(JSON.stringify(body))),
				)
			}
			this.session.send_and_read_async(
				message,
				GLib.PRIORITY_DEFAULT,
				this.cancellable,
				(_session, result) => {
					try {
						const bytes = this.session.send_and_read_finish(result)
						const text = new TextDecoder().decode(
							bytes.get_data() ?? new Uint8Array(),
						)
						let responseBody: unknown = null
						if (text) {
							try {
								responseBody = JSON.parse(text)
							} catch {
								/* Schema validation handles non-JSON success responses. */
							}
						}
						resolve({ status: message.status_code, body: responseBody })
					} catch {
						reject(
							new ConnectionError(
								'Cannot reach your API. Check your connection and try again.',
							),
						)
					}
				},
			)
		})
	}

	dispose(): void {
		this.cancellable.cancel()
		this.session.abort()
	}
}
