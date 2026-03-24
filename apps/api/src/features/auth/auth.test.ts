import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { treaty } from '@elysiajs/eden'
import { AUTH_ERRORS } from 'contracts'
import { app } from '@/app'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { REFRESH_TOKEN } from './constants'

const auth = treaty(app).api.v1.auth

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const VALID_USER = {
	email: 'test@example.com',
	name: 'Test User',
	password: 'password123',
}

async function registerUser(overrides?: Partial<typeof VALID_USER>) {
	return auth.register.post({ ...VALID_USER, ...overrides })
}

/** Extracts the refreshToken cookie string from a Set-Cookie header */
function getRefreshCookie(response: Response): string {
	const setCookie = response.headers.get('set-cookie') ?? ''
	const match = setCookie.match(new RegExp(`${REFRESH_TOKEN}=([^;]+)`))
	return match ? `${REFRESH_TOKEN}=${match[1]}` : ''
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})

afterEach(async () => {
	await cleanDatabase()
})

// ---------------------------------------------------------------------------
// POST /auth/register
// ---------------------------------------------------------------------------

describe('POST /auth/register', () => {
	it('creates a user and returns access token + sets refresh cookie', async () => {
		const { data, status, response } = await auth.register.post(VALID_USER)
		expect(status).toBe(200)
		expect(data?.user.email).toBe(VALID_USER.email)
		expect(data?.user.name).toBe(VALID_USER.name)
		expect(data?.user).not.toHaveProperty('passwordHash')
		expect(typeof data?.tokens.accessToken).toBe('string')
		expect(data?.tokens).not.toHaveProperty(REFRESH_TOKEN)
		expect(response.headers.get('set-cookie')).toContain(`${REFRESH_TOKEN}=`)
		expect(response.headers.get('set-cookie')).toContain('HttpOnly')
	})

	it('returns 409 when email is already taken', async () => {
		await auth.register.post(VALID_USER)
		const { error, status } = await auth.register.post(VALID_USER)
		expect(status).toBe(409)
		if (error?.status !== 409) throw new Error('Expected 409 error')
		expect(error.value.code).toBe(AUTH_ERRORS.EMAIL_TAKEN.code)
	})

	it('returns 422 for invalid request body', async () => {
		const { status } = await auth.register.post({
			email: 'not-an-email',
			name: 'X',
			password: 'pw',
		})
		expect(status).toBe(422)
	})
})

// ---------------------------------------------------------------------------
// POST /auth/login
// ---------------------------------------------------------------------------

describe('POST /auth/login', () => {
	it('returns access token and sets refresh cookie for valid credentials', async () => {
		await registerUser()
		const { data, status, response } = await auth.login.post({
			email: VALID_USER.email,
			password: VALID_USER.password,
		})
		expect(status).toBe(200)
		expect(typeof data?.tokens.accessToken).toBe('string')
		expect(data?.tokens).not.toHaveProperty(REFRESH_TOKEN)
		expect(response.headers.get('set-cookie')).toContain(`${REFRESH_TOKEN}=`)
		expect(response.headers.get('set-cookie')).toContain('HttpOnly')
	})

	it('returns 401 for wrong password', async () => {
		await registerUser()
		const { error, status } = await auth.login.post({
			email: VALID_USER.email,
			password: 'wrong-password',
		})
		expect(status).toBe(401)
		if (error?.status !== 401) throw new Error('Expected 401 error')
		expect(error.value.code).toBe(AUTH_ERRORS.INVALID_CREDENTIALS.code)
	})

	it('returns 401 for unknown email', async () => {
		const { status } = await auth.login.post({
			email: 'nobody@example.com',
			password: 'whatever',
		})
		expect(status).toBe(401)
	})
})

// ---------------------------------------------------------------------------
// POST /auth/refresh
// ---------------------------------------------------------------------------

describe('POST /auth/refresh', () => {
	it('returns new access token and rotates refresh cookie', async () => {
		const { response: registerResponse } = await registerUser()
		const cookie = getRefreshCookie(registerResponse)

		const { data, status, response } = await auth.refresh.post(
			{},
			{ headers: { cookie } },
		)
		expect(status).toBe(200)
		expect(typeof data?.tokens.accessToken).toBe('string')
		expect(data?.tokens).not.toHaveProperty(REFRESH_TOKEN)
		expect(response.headers.get('set-cookie')).toContain(`${REFRESH_TOKEN}=`)
	})

	it('refresh token is single-use', async () => {
		const { response: registerResponse } = await registerUser()
		const cookie = getRefreshCookie(registerResponse)

		await auth.refresh.post({}, { headers: { cookie } })
		const { status } = await auth.refresh.post({}, { headers: { cookie } })
		expect(status).toBe(401)
	})

	it('returns 401 when no cookie is sent', async () => {
		const { status } = await auth.refresh.post({})
		expect(status).toBe(401)
	})
})

// ---------------------------------------------------------------------------
// POST /auth/logout
// ---------------------------------------------------------------------------

describe('POST /auth/logout', () => {
	it('invalidates the refresh token', async () => {
		const { response: registerResponse } = await registerUser()
		const cookie = getRefreshCookie(registerResponse)

		await auth.logout.post({}, { headers: { cookie } })
		const { status } = await auth.refresh.post({}, { headers: { cookie } })
		expect(status).toBe(401)
	})
})

// ---------------------------------------------------------------------------
// GET /auth/me
// ---------------------------------------------------------------------------

describe('GET /auth/me', () => {
	it('returns the authenticated user', async () => {
		const { data: registered } = await registerUser()
		const { data, status } = await auth.me.get({
			headers: { authorization: `Bearer ${registered!.tokens.accessToken}` },
		})
		expect(status).toBe(200)
		expect(data?.email).toBe(VALID_USER.email)
		expect(data).not.toHaveProperty('passwordHash')
	})

	it('returns 401 with no token', async () => {
		const { status } = await auth.me.get({})
		expect(status).toBe(401)
	})

	it('returns 401 with an invalid token', async () => {
		const { status } = await auth.me.get({
			headers: { authorization: 'Bearer invalid.token.here' },
		})
		expect(status).toBe(401)
	})
})
