import type { ClientErrorReport } from '@my-time/contracts'
import { postClientError } from '@/dal/api/client'

const DEDUPE_MS = 60_000
const MAX_REPORTS = 20
const lastSent = new Map<string, number>()
let sent = 0

function toReport(error: unknown): ClientErrorReport {
	const message =
		error instanceof Error ? `${error.name}: ${error.message}` : String(error)
	return {
		source: 'extension',
		message: (message || 'Unknown error').slice(0, 1000),
		stack: error instanceof Error ? error.stack?.slice(0, 8000) : undefined,
		url: globalThis.location?.href.slice(0, 2000),
		appVersion: browser.runtime.getManifest().version,
	}
}

/** Sends an error to the API logs (production builds only, deduplicated). */
export function reportClientError(error: unknown): void {
	if (!import.meta.env.PROD || sent >= MAX_REPORTS) return
	const report = toReport(error)
	const previous = lastSent.get(report.message)
	if (previous !== undefined && Date.now() - previous < DEDUPE_MS) return
	lastSent.set(report.message, Date.now())
	sent++
	void postClientError(report)
}

/** Reports uncaught errors in this context (service worker or popup). */
export function installGlobalErrorReporting(): void {
	globalThis.addEventListener('error', (event) =>
		reportClientError(event.error ?? event.message),
	)
	globalThis.addEventListener('unhandledrejection', (event) =>
		reportClientError(event.reason),
	)
}
