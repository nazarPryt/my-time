import Gio from 'gi://Gio'
import GLib from 'gi://GLib'
import type Soup from 'gi://Soup?version=3.0'
import type { StreamConnection } from './session-stream.js'

/** Own the native stream, cancellation, and inactivity timer for one request. */
export class SoupStreamConnection implements StreamConnection {
	private cancellable = new Gio.Cancellable()
	private input: Gio.InputStream | undefined
	private closed = false
	private reading = false
	private released = false
	private watchdog = 0
	private lastReceived = GLib.get_real_time()

	constructor(
		private session: Soup.Session,
		private message: Soup.Message,
	) {}

	get status(): number {
		return this.message.status_code
	}
	get contentType(): string {
		return this.message.response_headers.get_one('Content-Type') ?? ''
	}

	async open(): Promise<void> {
		this.watchdog = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 5, () => {
			// Wall time also detects a silent connection after suspend/resume.
			if (GLib.get_real_time() - this.lastReceived <= 60_000_000)
				return GLib.SOURCE_CONTINUE
			this.watchdog = 0
			this.close()
			return GLib.SOURCE_REMOVE
		})
		try {
			this.input = await new Promise<Gio.InputStream>((resolve, reject) => {
				this.session.send_async(
					this.message,
					GLib.PRIORITY_DEFAULT,
					this.cancellable,
					(_session, result) => {
						try {
							resolve(this.session.send_finish(result))
						} catch (error) {
							reject(error)
						}
					},
				)
			})
			if (this.closed) {
				this.release()
				throw new Error('Connection closed.')
			}
		} catch (error) {
			this.close()
			throw error
		}
	}

	async read(): Promise<Uint8Array | null> {
		const input = this.input
		if (this.closed || !input) throw new Error('Connection closed.')
		if (this.reading) throw new Error('A stream read is already pending.')
		this.reading = true
		try {
			const bytes = await new Promise<GLib.Bytes>((resolve, reject) => {
				input.read_bytes_async(
					4096,
					GLib.PRIORITY_DEFAULT,
					this.cancellable,
					(_stream, result) => {
						try {
							resolve(input.read_bytes_finish(result))
						} catch (error) {
							reject(error)
						}
					},
				)
			})
			this.lastReceived = GLib.get_real_time()
			const data = bytes.get_data()
			return data?.length ? data : null
		} finally {
			this.reading = false
			if (this.closed) this.release()
		}
	}

	close(): void {
		if (this.closed) return
		this.closed = true
		this.cancellable.cancel()
		if (this.watchdog) GLib.Source.remove(this.watchdog)
		this.watchdog = 0
		this.release()
	}

	private release(): void {
		if (!this.input || this.reading || this.released) return
		this.released = true
		this.input.close_async(GLib.PRIORITY_DEFAULT, null, (stream, result) => {
			try {
				stream?.close_finish(result)
			} catch {
				/* Cancellation may already have closed the socket. */
			}
		})
	}
}
