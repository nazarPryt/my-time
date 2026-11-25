import {
	API_PREFIX,
	CLIENT_ERRORS_ROUTES,
	type ClientErrorReport,
} from '@my-time/contracts'
import { APP_VERSION } from '@/shared/config/app-version'
import { WEB_CONFIG } from '@/shared/config/web-config'
import { tokenStorage } from '../token-storage'
import { buildClientErrorReport } from './build-client-error-report'
import { createErrorReporter } from './create-error-reporter'

const ENDPOINT = `${WEB_CONFIG.API_URL}${API_PREFIX}${CLIENT_ERRORS_ROUTES.prefix}${CLIENT_ERRORS_ROUTES.root}`

// Plain fetch, not the api client: reporting must never trigger a token
// refresh or report its own failure.
function send(report: ClientErrorReport): void {
	const token = tokenStorage.getAccessToken()
	void fetch(ENDPOINT, {
		method: 'POST',
		keepalive: true,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: JSON.stringify(report),
	}).catch(() => {})
}

const report = createErrorReporter(send)

/** Sends an error to the API logs (production builds only). */
export function reportClientError(error: unknown): void {
	if (!import.meta.env.PROD) return
	report(
		buildClientErrorReport(error, {
			url: window.location.href,
			appVersion: APP_VERSION,
		}),
	)
}

let installed = false

/** Reports errors nothing else caught: uncaught exceptions and rejections. */
export function installGlobalErrorReporting(): void {
	if (installed) return
	installed = true
	window.addEventListener('error', (event) => {
		// Cross-origin scripts hide their details; such a report says nothing.
		if (!event.error && event.message === 'Script error.') return
		reportClientError(event.error ?? event.message)
	})
	window.addEventListener('unhandledrejection', (event) =>
		reportClientError(event.reason),
	)
}
