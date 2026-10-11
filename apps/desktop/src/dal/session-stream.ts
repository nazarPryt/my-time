import { SessionStreamParser } from '@my-time/session-sync'
import type { SessionResponse } from 'contracts'

export interface StreamConnection {
	status: number
	contentType: string
	read(): Promise<Uint8Array | null>
	close(): void
}

export interface SessionStreamTransport {
	open(path: string, accessToken: string): Promise<StreamConnection>
	dispose(): void
}

/** Consume one validated connection; the API client owns auth and cleanup. */
export async function readSessionSnapshots(
	connection: StreamConnection,
	onSession: (session: SessionResponse | null) => void,
	assertActive: () => void,
): Promise<void> {
	const parser = new SessionStreamParser((session) => {
		assertActive()
		onSession(session)
	})
	while (true) {
		const chunk = await connection.read()
		assertActive()
		if (!chunk) return
		parser.push(chunk)
	}
}
