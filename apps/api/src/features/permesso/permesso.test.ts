import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { db } from '@db'
import { permessoChecks, permessoSubscriptions } from '@db/schema'
import { treaty } from '@elysiajs/eden'
import type { RegisterRequest } from 'contracts'
import {
	AuthResponseSchema,
	PermessoCheckHistoryResponseSchema,
	PermessoStatusResponseSchema,
} from 'contracts'
import { parseISO } from 'date-fns'
import { eq } from 'drizzle-orm'
import { app } from '@/app'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { getHourInTimeZone } from './jobs'

// ---------------------------------------------------------------------------
// Eden Treaty client
// ---------------------------------------------------------------------------

const api = treaty(app).api.v1

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_USER: RegisterRequest = {
	email: 'permesso@example.com',
	name: 'Permesso User',
	password: 'password123',
}

async function registerAndGetToken(user: RegisterRequest) {
	const { data } = await api.auth.register.post(user)
	const auth = AuthResponseSchema.parse(data)
	return {
		token: auth.tokens.accessToken,
		userId: auth.user.id,
	}
}

function authHeaders(token: string) {
	return { authorization: `Bearer ${token}` }
}

/** Reads the raw permesso_subscriptions row for a user directly via drizzle */
async function getSubscriptionRow(userId: string) {
	const [row] = await db
		.select()
		.from(permessoSubscriptions)
		.where(eq(permessoSubscriptions.userId, userId))
	return row ?? null
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
// getHourInTimeZone — pure unit tests
// ---------------------------------------------------------------------------

describe('getHourInTimeZone', () => {
	// 2026-01-15T14:00:00Z is standard time in Rome (CET, UTC+1) — outside DST.
	const JANUARY_INSTANT = parseISO('2026-01-15T14:00:00.000Z')
	// 2026-07-15T14:00:00Z is daylight saving time in Rome (CEST, UTC+2).
	const JULY_INSTANT = parseISO('2026-07-15T14:00:00.000Z')

	it('returns the same hour for a plain UTC timezone (offset 0)', () => {
		expect(getHourInTimeZone(JANUARY_INSTANT, 'UTC')).toBe(14)
	})

	it('applies a whole-hour offset (Europe/Rome, UTC+1 in January)', () => {
		expect(getHourInTimeZone(JANUARY_INSTANT, 'Europe/Rome')).toBe(15)
	})

	it('applies a half-hour offset (Asia/Kolkata, UTC+5:30)', () => {
		// 14:00 UTC + 5:30 = 19:30 local — the hour component is 19. A naive
		// fixed whole-hour-offset implementation would get this wrong.
		expect(getHourInTimeZone(JANUARY_INSTANT, 'Asia/Kolkata')).toBe(19)
	})

	it('falls back to the UTC hour for an invalid timezone string', () => {
		expect(getHourInTimeZone(JANUARY_INSTANT, 'Not/AZone')).toBe(14)
	})

	it('accounts for DST — Rome offset differs between January and July', () => {
		const januaryHour = getHourInTimeZone(JANUARY_INSTANT, 'Europe/Rome')
		const julyHour = getHourInTimeZone(JULY_INSTANT, 'Europe/Rome')
		// Same wall-clock UTC hour (14) in both cases, but January is CET (+1)
		// and July is CEST (+2) — proves the offset isn't hardcoded.
		expect(januaryHour).toBe(15)
		expect(julyHour).toBe(16)
	})
})

// ---------------------------------------------------------------------------
// PUT /permesso/schedule
// ---------------------------------------------------------------------------

describe('PUT /permesso/schedule', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api.permesso.schedule.put({
			checkHours: [9, 18],
			timezone: 'Europe/Rome',
		})
		expect(status).toBe(401)
	})

	it('returns 422 for an invalid (non-IANA) timezone string', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api.permesso.schedule.put(
			{ checkHours: [9, 18], timezone: 'Not/AZone' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(422)
	})

	it('returns 422 when checkHours contains an out-of-range value (24)', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api.permesso.schedule.put(
			{ checkHours: [24], timezone: 'Europe/Rome' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(422)
	})

	it('returns 422 when checkHours contains an out-of-range value (-1)', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api.permesso.schedule.put(
			{ checkHours: [-1], timezone: 'Europe/Rome' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(422)
	})

	it('does nothing when the user has no practice number set yet (no row exists)', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)

		// No PUT /permesso (practice number) call was made, so no subscription
		// row exists yet. repository.updateCheckHours only UPDATEs — it never
		// inserts — so this affects zero rows.
		const { data, status } = await api.permesso.schedule.put(
			{ checkHours: [9, 18], timezone: 'Europe/Rome' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(200)
		const parsed = PermessoStatusResponseSchema.parse(data)
		// toStatusResponse(null) — the default shape, request is effectively a no-op.
		expect(parsed.practiceNumber).toBeNull()
		expect(parsed.checkHours).toEqual([])

		const row = await getSubscriptionRow(userId)
		expect(row).toBeNull()
	})

	it('persists checkHours and timezone once a practice number exists', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		await api.permesso.put(
			{ practiceNumber: 'AB12345678' },
			{ headers: authHeaders(token) },
		)

		const { data, status } = await api.permesso.schedule.put(
			{ checkHours: [18, 9], timezone: 'Europe/Rome' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(200)
		const parsed = PermessoStatusResponseSchema.parse(data)
		// service.updateCheckHours dedupes + sorts ascending.
		expect(parsed.checkHours).toEqual([9, 18])

		// The response schema does not expose `timezone` — assert persistence
		// by reading the row directly.
		const row = await getSubscriptionRow(userId)
		expect(row?.timezone).toBe('Europe/Rome')
		expect(row?.checkHours).toEqual([9, 18])
	})

	it('dedupes duplicate checkHours entries', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		await api.permesso.put(
			{ practiceNumber: 'AB12345678' },
			{ headers: authHeaders(token) },
		)

		const { data, status } = await api.permesso.schedule.put(
			{ checkHours: [9, 9, 18, 18, 9], timezone: 'Europe/Rome' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(200)
		const parsed = PermessoStatusResponseSchema.parse(data)
		expect(parsed.checkHours).toEqual([9, 18])

		const row = await getSubscriptionRow(userId)
		expect(row?.checkHours).toEqual([9, 18])
	})
})

// ---------------------------------------------------------------------------
// POST /permesso/reset
// ---------------------------------------------------------------------------

describe('POST /permesso/reset', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api.permesso.reset.post()
		expect(status).toBe(401)
	})

	it('wipes practice number, schedule, telegram link, and history, returning the empty status', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)

		await api.permesso.put(
			{ practiceNumber: 'AB12345678' },
			{ headers: authHeaders(token) },
		)
		await api.permesso.schedule.put(
			{ checkHours: [9, 18], timezone: 'Europe/Rome' },
			{ headers: authHeaders(token) },
		)
		// Seed a check history row directly — POST /permesso/check would hit the
		// real government portal, which is not something a test should depend on.
		await db.insert(permessoChecks).values({
			userId,
			success: true,
			status: 'In lavorazione',
			triggeredBy: 'manual',
		})

		const { data, status } = await api.permesso.reset.post(undefined, {
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const parsed = PermessoStatusResponseSchema.parse(data)
		expect(parsed).toEqual({
			practiceNumber: null,
			checkHours: [],
			lastStatus: null,
			lastCheckedAt: null,
			lastError: null,
			telegramConnected: false,
		})
	})

	it('leaves no trace behind — GET /permesso and GET /permesso/history both come back empty', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)

		await api.permesso.put(
			{ practiceNumber: 'AB12345678' },
			{ headers: authHeaders(token) },
		)
		await db.insert(permessoChecks).values({
			userId,
			success: false,
			error: 'timeout',
			triggeredBy: 'scheduled',
		})

		await api.permesso.reset.post(undefined, { headers: authHeaders(token) })

		const { data: statusData, status: statusCode } = await api.permesso.get({
			headers: authHeaders(token),
		})
		expect(statusCode).toBe(200)
		expect(PermessoStatusResponseSchema.parse(statusData)).toEqual({
			practiceNumber: null,
			checkHours: [],
			lastStatus: null,
			lastCheckedAt: null,
			lastError: null,
			telegramConnected: false,
		})

		const { data: historyData, status: historyCode } =
			await api.permesso.history.get({ headers: authHeaders(token) })
		expect(historyCode).toBe(200)
		expect(PermessoCheckHistoryResponseSchema.parse(historyData)).toEqual([])

		// The row is actually deleted, not just filtered out of the response.
		const row = await getSubscriptionRow(userId)
		expect(row).toBeNull()
	})

	it('is a no-op that still returns the empty status when the user has no subscription row', async () => {
		const { token } = await registerAndGetToken(VALID_USER)

		const { data, status } = await api.permesso.reset.post(undefined, {
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		expect(PermessoStatusResponseSchema.parse(data)).toEqual({
			practiceNumber: null,
			checkHours: [],
			lastStatus: null,
			lastCheckedAt: null,
			lastError: null,
			telegramConnected: false,
		})
	})
})
