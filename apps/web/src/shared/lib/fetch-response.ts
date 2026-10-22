const TIMEOUT_MS = 15_000
export type FetchResponse = (
	input: RequestInfo | URL,
	init?: RequestInit,
) => Promise<Response>

function requestSignal(
	input: RequestInfo | URL,
	init?: RequestInit,
): AbortSignal | undefined {
	return init?.signal ?? (input instanceof Request ? input.signal : undefined)
}

/** JSON requests keep a timeout for headers and body consumption. */
export const fetchJsonResponse: FetchResponse = (input, init) => {
	const existing = requestSignal(input, init)
	const timeout = AbortSignal.timeout(TIMEOUT_MS)
	const signal = existing ? AbortSignal.any([existing, timeout]) : timeout
	return fetch(input, { ...init, credentials: 'include', signal })
}

/** The caller owns stream liveness after the response headers arrive. */
export const fetchStreamResponse: FetchResponse = async (input, init) => {
	const controller = new AbortController()
	const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
	const existing = requestSignal(input, init)
	const signal = existing
		? AbortSignal.any([existing, controller.signal])
		: controller.signal
	try {
		return await fetch(input, { ...init, credentials: 'include', signal })
	} finally {
		clearTimeout(timer)
	}
}
