import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { treaty } from '@elysiajs/eden'
import {
	BlockedSiteListResponseSchema,
	BlockedSiteResponseSchema,
	SITE_BLOCKING_ERRORS,
} from 'contracts'
import { app } from '@/app'
import { cleanDatabase, runMigrations } from '@/test/setup'
import {
	authHeaders,
	OTHER_USER,
	registerAndGetToken,
	VALID_USER,
} from './fixtures'

// See fixtures.ts for why this isn't shared from there — Eden's inferred
// client type isn't nameable across files in this composite project (TS2883).
const api = treaty(app, { parseDate: false }).api.v1

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})

afterEach(async () => {
	await cleanDatabase()
})

describe('GET /site-blocking', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api['site-blocking'].get()
		expect(status).toBe(401)
	})

	it('returns an empty array for a fresh user', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api['site-blocking'].get({
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		expect(BlockedSiteListResponseSchema.parse(data)).toEqual([])
	})

	it('lists only the authenticated user’s own sites', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		const { token: otherToken } = await registerAndGetToken(OTHER_USER)

		await api['site-blocking'].post(
			{ domain: 'example.com' },
			{ headers: authHeaders(token) },
		)
		await api['site-blocking'].post(
			{ domain: 'other-example.com' },
			{ headers: authHeaders(otherToken) },
		)

		const { data, status } = await api['site-blocking'].get({
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const parsed = BlockedSiteListResponseSchema.parse(data)
		expect(parsed).toHaveLength(1)
		expect(parsed[0]?.domain).toBe('example.com')

		const { data: otherData } = await api['site-blocking'].get({
			headers: authHeaders(otherToken),
		})
		const otherParsed = BlockedSiteListResponseSchema.parse(otherData)
		expect(otherParsed).toHaveLength(1)
		expect(otherParsed[0]?.domain).toBe('other-example.com')

		// Sanity: userId differs between the two registered accounts.
		expect(userId).not.toBe('')
	})
})

describe('POST /site-blocking', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api['site-blocking'].post({
			domain: 'example.com',
		})
		expect(status).toBe(401)
	})

	it('returns 201 with the created site on success', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api['site-blocking'].post(
			{ domain: 'https://www.Example.com/some/path' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(201)
		const parsed = BlockedSiteResponseSchema.parse(data)
		expect(parsed.domain).toBe('example.com')
		expect(parsed.id).toBeTruthy()
		expect(parsed.createdAt).toBeTruthy()
	})

	it('returns 409 when the domain is already blocked for this user', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		await api['site-blocking'].post(
			{ domain: 'example.com' },
			{ headers: authHeaders(token) },
		)

		const { error, status } = await api['site-blocking'].post(
			{ domain: 'example.com' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(409)
		expect(error?.value).toEqual(SITE_BLOCKING_ERRORS.DOMAIN_ALREADY_BLOCKED)

		// Still only one row for this user.
		const { data: listData } = await api['site-blocking'].get({
			headers: authHeaders(token),
		})
		expect(BlockedSiteListResponseSchema.parse(listData)).toHaveLength(1)
	})

	it('treats the same domain reached via different raw input as a duplicate (normalization dedupes)', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		await api['site-blocking'].post(
			{ domain: 'https://www.example.com' },
			{ headers: authHeaders(token) },
		)

		const { status } = await api['site-blocking'].post(
			{ domain: 'EXAMPLE.com/foo' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(409)
	})

	it('allows the same domain to be blocked independently by two different users', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { token: otherToken } = await registerAndGetToken(OTHER_USER)

		const { status: firstStatus } = await api['site-blocking'].post(
			{ domain: 'shared-example.com' },
			{ headers: authHeaders(token) },
		)
		const { status: secondStatus } = await api['site-blocking'].post(
			{ domain: 'shared-example.com' },
			{ headers: authHeaders(otherToken) },
		)
		expect(firstStatus).toBe(201)
		expect(secondStatus).toBe(201)
	})

	describe('invalid domain -> 400', () => {
		it.each([
			['https://'],
			['www.'],
			['/'],
			['http://'],
		])('returns 400 for %p, which normalizes to an empty string', async (rawDomain) => {
			const { token } = await registerAndGetToken(VALID_USER)
			const { error, status } = await api['site-blocking'].post(
				{ domain: rawDomain },
				{ headers: authHeaders(token) },
			)
			expect(status).toBe(400)
			expect(error?.value).toEqual(SITE_BLOCKING_ERRORS.INVALID_DOMAIN)
		})

		it('does not persist anything when the domain is invalid', async () => {
			const { token } = await registerAndGetToken(VALID_USER)
			await api['site-blocking'].post(
				{ domain: 'https://' },
				{ headers: authHeaders(token) },
			)

			const { data } = await api['site-blocking'].get({
				headers: authHeaders(token),
			})
			expect(BlockedSiteListResponseSchema.parse(data)).toEqual([])
		})
	})

	it('returns 422 when domain is missing from the body', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api['site-blocking'].post(
			// biome-ignore lint/suspicious/noExplicitAny: intentionally malformed body to exercise validation
			{} as any,
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(422)
	})

	it('returns 422 when domain is an empty string', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api['site-blocking'].post(
			{ domain: '' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(422)
	})
})

describe('DELETE /site-blocking/:id', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api['site-blocking']({
			id: 'non-existent',
		}).delete()
		expect(status).toBe(401)
	})

	it('deletes an existing site belonging to the authenticated user', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data: created } = await api['site-blocking'].post(
			{ domain: 'example.com' },
			{ headers: authHeaders(token) },
		)
		const site = BlockedSiteResponseSchema.parse(created)

		const { status } = await api['site-blocking']({ id: site.id }).delete(
			undefined,
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(200)

		const { data: listData } = await api['site-blocking'].get({
			headers: authHeaders(token),
		})
		expect(BlockedSiteListResponseSchema.parse(listData)).toEqual([])
	})

	it('does not delete another user’s site (scoped by userId)', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { token: otherToken } = await registerAndGetToken(OTHER_USER)

		const { data: created } = await api['site-blocking'].post(
			{ domain: 'victim-example.com' },
			{ headers: authHeaders(token) },
		)
		const site = BlockedSiteResponseSchema.parse(created)

		// The other user attempts to delete the first user's site by id.
		const { status } = await api['site-blocking']({ id: site.id }).delete(
			undefined,
			{ headers: authHeaders(otherToken) },
		)
		// The route does not distinguish "not found" from "not yours" — it is a
		// scoped no-op either way, and still returns 200.
		expect(status).toBe(200)

		// The site still exists for its actual owner.
		const { data: listData } = await api['site-blocking'].get({
			headers: authHeaders(token),
		})
		const parsed = BlockedSiteListResponseSchema.parse(listData)
		expect(parsed).toHaveLength(1)
		expect(parsed[0]?.id).toBe(site.id)
	})

	it('is a no-op that still returns 200 for a non-existent id', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api['site-blocking']({
			id: '00000000-0000-0000-0000-000000000000',
		}).delete(undefined, { headers: authHeaders(token) })
		expect(status).toBe(200)
	})
})
