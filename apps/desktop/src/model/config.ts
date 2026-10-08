import { API_PREFIX } from 'contracts'

/** GJS does not provide the browser URL API. Keep URL checks runtime-independent. */
export function normalizeUrl(input: string): string {
	const value = input.trim().replace(/\/+$/, '')
	const match =
		/^(https?):\/\/(\[[\da-f:]+\]|[\w.-]+)(?::(\d+))?(\/[^?#\s]*)?$/i.exec(
			value,
		)
	if (!match || value.includes('\\')) {
		throw new Error(
			'Enter an HTTP or HTTPS URL without credentials, a query, or a fragment.',
		)
	}
	const [, scheme, host, port] = match
	if (port && (Number(port) < 1 || Number(port) > 65535)) {
		throw new Error('The URL port must be between 1 and 65535.')
	}
	const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(
		host.toLowerCase(),
	)
	if (scheme.toLowerCase() === 'http' && !loopback) {
		throw new Error(
			'Use HTTPS for your server. HTTP is supported only on localhost.',
		)
	}
	return value
}

export function normalizeApiUrl(input: string): string {
	const url = normalizeUrl(input)
	return url.endsWith(API_PREFIX) ? url : `${url}${API_PREFIX}`
}
