import type { ClientErrorReport } from '@my-time/contracts'

const MAX_MESSAGE = 1000
const MAX_STACK = 8000
const MAX_URL = 2000

function describe(error: unknown): { message: string; stack?: string } {
	if (error instanceof Error)
		return { message: `${error.name}: ${error.message}`, stack: error.stack }
	if (typeof error === 'string') return { message: error }
	try {
		return { message: JSON.stringify(error) ?? String(error) }
	} catch {
		return { message: String(error) }
	}
}

/** Turns anything thrown into a report that fits the API's size limits. */
export function buildClientErrorReport(
	error: unknown,
	meta: { url: string; appVersion: string },
): ClientErrorReport {
	const { message, stack } = describe(error)
	return {
		source: 'web',
		message: (message || 'Unknown error').slice(0, MAX_MESSAGE),
		stack: stack?.slice(0, MAX_STACK),
		url: meta.url.slice(0, MAX_URL),
		appVersion: meta.appVersion,
	}
}
