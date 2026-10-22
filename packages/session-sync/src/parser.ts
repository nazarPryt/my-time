import {
	DESKTOP_PRESENCE_EVENT,
	type DesktopPresence,
	DesktopPresenceSchema,
	SESSION_STREAM_EVENT,
	type SessionResponse,
	SessionStreamStateSchema,
	type TimerSnapshot,
} from 'contracts'

/** Decode complete lines so split UTF-8 works without GJS decoder streaming. */
export class SessionStreamParser {
	private line: number[] = []
	private event = ''
	private data: string[] = []
	private size = 0
	private afterCR = false
	private firstLine = true
	private decoder = new TextDecoder()

	private onSession: (
		session: SessionResponse | null,
		timer?: TimerSnapshot,
	) => void

	private onDesktopPresence: ((presence: DesktopPresence) => void) | undefined

	constructor(
		onSession: (session: SessionResponse | null, timer?: TimerSnapshot) => void,
		onDesktopPresence?: (presence: DesktopPresence) => void,
	) {
		this.onSession = onSession
		this.onDesktopPresence = onDesktopPresence
	}

	push(chunk: Uint8Array): void {
		for (const byte of chunk) {
			if (this.afterCR) {
				this.afterCR = false
				if (byte === 10) continue
			}
			if (++this.size > 65_536) throw new Error('Session event is too large.')
			if (byte === 10 || byte === 13) {
				this.finishLine()
				this.afterCR = byte === 13
			} else {
				this.line.push(byte)
			}
		}
	}

	private finishLine(): void {
		let line = this.decoder.decode(new Uint8Array(this.line))
		this.line = []
		if (this.firstLine) {
			line = line.replace(/^\uFEFF/, '')
			this.firstLine = false
		}
		if (!line) {
			if (this.event === SESSION_STREAM_EVENT && this.data.length) {
				const state = SessionStreamStateSchema.parse(
					JSON.parse(this.data.join('\n')),
				)
				if (state.timer) this.onSession(state.activeSession, state.timer)
				else this.onSession(state.activeSession)
			}
			if (
				this.event === DESKTOP_PRESENCE_EVENT &&
				this.data.length &&
				this.onDesktopPresence
			) {
				this.onDesktopPresence(
					DesktopPresenceSchema.parse(JSON.parse(this.data.join('\n'))),
				)
			}
			this.event = ''
			this.data = []
			this.size = 0
			return
		}
		if (line.startsWith(':')) return
		const colon = line.indexOf(':')
		const field = colon < 0 ? line : line.slice(0, colon)
		const value = colon < 0 ? '' : line.slice(colon + 1).replace(/^ /, '')
		if (field === 'event') this.event = value
		if (field === 'data') this.data.push(value)
	}
}
