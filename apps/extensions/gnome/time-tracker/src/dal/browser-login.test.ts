import { expect, test } from 'bun:test'
import { AUTH_ROUTES } from 'contracts'
import type { HttpTransport, TokenStore, Tokens } from './api-client'
import { BrowserLogin } from './browser-login'

const request = {
	requestId: 'b1537b0a-47c7-4a28-bbc6-b4bb5c2b3e7d',
	deviceSecret: 'a'.repeat(64),
	confirmationCode: 'ABC12345',
	expiresIn: 300,
	interval: 5,
}
const tokens = {
	accessToken: 'desktop-access',
	refreshToken: 'desktop-refresh',
}
function fixture(results: unknown[]) {
	const sent: { path: string; body: unknown }[] = []
	const saved: Tokens[] = []
	const waits: number[] = []
	const transport: HttpTransport = {
		send: async (_method, path, body) => {
			sent.push({ path, body })
			return {
				status: 200,
				body: path.endsWith(AUTH_ROUTES.desktopPairingStart)
					? request
					: results.shift(),
			}
		},
		dispose() {},
	}
	const storage: TokenStore = {
		load: async () => null,
		save: async (value) => {
			saved.push(value)
		},
		clear: async () => {},
		dispose() {},
	}
	const login = new BrowserLogin(transport, storage, {
		wait: async (ms) => {
			waits.push(ms)
		},
		dispose() {},
	})
	return { login, sent, saved, waits }
}

test('browser sign-in waits for approval and saves only desktop credentials', async () => {
	const f = fixture([
		{ status: 'pending' },
		{ status: 'connected', email: 'test@example.com', tokens },
	])
	let opened = false
	const email = await f.login.login(async (value) => {
		expect(value).toEqual(request)
		opened = true
	})
	expect(opened).toBe(true)
	expect(email).toBe('test@example.com')
	expect(f.saved).toEqual([tokens])
	expect(f.sent[1].body).toEqual({
		requestId: request.requestId,
		deviceSecret: request.deviceSecret,
	})
	expect(f.waits).toEqual([5000, 5000])
})

test('polling slows down when instructed by the server', async () => {
	const f = fixture([
		{ status: 'slow_down' },
		{ status: 'connected', email: 'test@example.com', tokens },
	])
	await f.login.login(async () => {})
	expect(f.waits).toEqual([5000, 10000])
})

test('expired approval never saves tokens', async () => {
	const f = fixture([{ status: 'expired' }])
	await expect(f.login.login(async () => {})).rejects.toThrow('expired')
	expect(f.saved).toEqual([])
})

test('cancelling while browser is opening prevents polling and token storage', async () => {
	const f = fixture([
		{ status: 'connected', email: 'test@example.com', tokens },
	])
	await expect(
		f.login.login(async () => {
			f.login.dispose()
		}),
	).rejects.toThrow('cancelled')
	expect(f.sent).toHaveLength(1)
	expect(f.saved).toEqual([])
})
