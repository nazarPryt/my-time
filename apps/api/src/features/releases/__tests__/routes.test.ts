import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { treaty } from '@elysiajs/eden'
import type { RegisterRequest } from '@my-time/contracts'
import {
	AuthResponseSchema,
	RELEASE_NOTES,
	RELEASES_ERRORS,
	SeenReleaseResponseSchema,
} from '@my-time/contracts'
import { app } from '@/app'
import { cleanDatabase, runMigrations } from '@/test/setup'

const api = treaty(app, { parseDate: false }).api.v1

const USER: RegisterRequest = {
	email: 'releases@example.com',
	name: 'Releases User',
	password: 'password123',
}

const LATEST = RELEASE_NOTES[0]?.version ?? '0.0.0'

async function registerAndGetHeaders() {
	const { data } = await api.auth.register.post(USER)
	const auth = AuthResponseSchema.parse(data)
	return { authorization: `Bearer ${auth.tokens.accessToken}` }
}

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})

afterEach(async () => {
	await cleanDatabase()
})

describe('GET /releases/seen', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api.releases.seen.get()
		expect(status).toBe(401)
	})

	it('returns null for a user who never opened the release notes', async () => {
		const headers = await registerAndGetHeaders()
		const { data, status } = await api.releases.seen.get({ headers })
		expect(status).toBe(200)
		expect(SeenReleaseResponseSchema.parse(data)).toEqual({
			lastSeenVersion: null,
		})
	})
})

describe('PUT /releases/seen', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api.releases.seen.put({ version: LATEST })
		expect(status).toBe(401)
	})

	it('stores the version and returns it on the next read', async () => {
		const headers = await registerAndGetHeaders()
		const put = await api.releases.seen.put({ version: LATEST }, { headers })
		expect(put.status).toBe(200)
		expect(put.data).toEqual({ lastSeenVersion: LATEST })

		const { data } = await api.releases.seen.get({ headers })
		expect(data).toEqual({ lastSeenVersion: LATEST })
	})

	it('rejects a version that has no release notes', async () => {
		const headers = await registerAndGetHeaders()
		const { status, error } = await api.releases.seen.put(
			{ version: '999.0.0' },
			{ headers },
		)
		expect(status).toBe(400)
		expect(error?.value).toEqual(RELEASES_ERRORS.UNKNOWN_VERSION)
	})

	it('rejects a malformed version', async () => {
		const headers = await registerAndGetHeaders()
		const { status } = await api.releases.seen.put(
			{ version: 'latest' },
			{ headers },
		)
		expect(status).toBe(422)
	})
})
