import { createServer } from 'node:http'
import { API_PREFIX, AUTH_ROUTES, SITE_BLOCKING_ROUTES } from 'contracts'

export const RUNTIME_ORIGIN = 'http://127.0.0.1:3199'
export const BLOCKED_DOMAIN = 'blocked.localhost'
export const SECOND_DOMAIN = 'second.localhost'
export const ALLOWED_DOMAIN = 'allowed.localhost'
export const FIRST_ACCOUNT = {
	accessToken: 'extension-account-one',
	refreshToken: 'extension-refresh-one',
}
export const SECOND_ACCOUNT = {
	accessToken: 'extension-account-two',
	refreshToken: 'extension-refresh-two',
}
export const FIRST_CONNECT_TOKEN = 'connect-account-one'
export const SECOND_CONNECT_TOKEN = 'connect-account-two'
export const RUNTIME_PASSWORD = 'Extension-test-password1!'
export const RUNTIME_EMAIL = 'extension@example.com'

export async function startRuntimeServer() {
	const requests: string[] = []
	const server = createServer(async (request, response) => {
		response.setHeader('Access-Control-Allow-Origin', '*')
		response.setHeader(
			'Access-Control-Allow-Headers',
			'Content-Type, Authorization',
		)
		if (request.method === 'OPTIONS') {
			response.end()
			return
		}
		const path = new URL(request.url ?? '/', RUNTIME_ORIGIN).pathname
		let body = ''
		for await (const chunk of request) body += chunk
		response.setHeader('Content-Type', 'application/json')
		if (
			path ===
			`${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.exchangeExtensionToken}`
		) {
			const { token } = JSON.parse(body)
			response.end(
				JSON.stringify(
					token === SECOND_CONNECT_TOKEN ? SECOND_ACCOUNT : FIRST_ACCOUNT,
				),
			)
		} else if (
			path === `${API_PREFIX}${AUTH_ROUTES.prefix}${AUTH_ROUTES.loginExtension}`
		) {
			response.end(JSON.stringify(FIRST_ACCOUNT))
		} else if (path === `${API_PREFIX}${SITE_BLOCKING_ROUTES.prefix}`) {
			const authorization = request.headers.authorization ?? ''
			requests.push(authorization)
			const domain =
				authorization === `Bearer ${SECOND_ACCOUNT.accessToken}`
					? SECOND_DOMAIN
					: BLOCKED_DOMAIN
			response.end(
				JSON.stringify([
					{ id: 'runtime-site', domain, createdAt: '2026-10-12T08:00:00.000Z' },
				]),
			)
		} else {
			response.setHeader('Content-Type', 'text/html')
			response.end(
				'<html><body><main data-testid="runtime-page">Allowed local page</main></body></html>',
			)
		}
	})
	await new Promise<void>((resolve, reject) => {
		server.once('error', reject)
		server.listen(3199, '0.0.0.0', resolve)
	})
	return {
		requests,
		close: () =>
			new Promise<void>((resolve, reject) =>
				server.close((error) => (error ? reject(error) : resolve())),
			),
	}
}
