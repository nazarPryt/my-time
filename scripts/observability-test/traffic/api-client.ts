import { API_PREFIX } from '../../../packages/contracts/src/api-routes'
import { API_URL } from '../config'

type CallInit = RequestInit & { token?: string; cookie?: string }

/** Calls the test API and fails unless it answers with `status`. */
export async function expectStatus(
	path: string,
	status: number,
	init: CallInit = {},
): Promise<Response> {
	const headers = new Headers(init.headers)
	if (init.body) headers.set('content-type', 'application/json')
	if (init.token) headers.set('authorization', `Bearer ${init.token}`)
	if (init.cookie) headers.set('cookie', init.cookie)
	const response = await fetch(`${API_URL}${API_PREFIX}${path}`, {
		...init,
		headers,
	})
	if (response.status !== status)
		throw new Error(
			`${init.method ?? 'GET'} ${path} answered ${response.status}, expected ${status}: ${await response.text()}`,
		)
	return response
}

export const jsonBody = (body: unknown) => JSON.stringify(body)

/** The refresh-token cookie from a login/register response, ready to send back. */
export function refreshCookie(response: Response): string | undefined {
	return response.headers
		.getSetCookie()
		.find((cookie) => cookie.startsWith('refreshToken='))
		?.split(';')[0]
}

/** Opens a live SSE stream, waits for its first event, then closes it. */
export async function touchStream(path: string, token: string) {
	const stream = new AbortController()
	const response = await expectStatus(path, 200, {
		token,
		signal: stream.signal,
	})
	await response.body?.getReader().read()
	stream.abort()
}
