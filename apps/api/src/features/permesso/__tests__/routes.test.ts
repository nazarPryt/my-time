import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { db } from '@db'
import { permessoChecks, permessoSubscriptions } from '@db/schema'
import { treaty } from '@elysiajs/eden'
import {
	CheckResultResponseSchema,
	PermessoCheckHistoryResponseSchema,
	PermessoStatusResponseSchema,
	TelegramLinkResponseSchema,
} from 'contracts'
import { addSeconds, parseISO } from 'date-fns'
import { eq } from 'drizzle-orm'
import { app } from '@/app'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { permessoRepository } from '../repository'
import {
	authHeaders,
	buildTelegramDeepLinkMock,
	checkPermessoStatusMock,
	clearFixtureMocks,
	getSubscriptionRow,
	registerAndGetToken,
	sendTelegramCheckResultMock,
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
	clearFixtureMocks()
})

describe('PUT /permesso', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api.permesso.put({ practiceNumber: 'AB12345678' })
		expect(status).toBe(401)
	})

	it('creates a fresh subscription row, reflected by GET /permesso', async () => {
		const { token } = await registerAndGetToken(VALID_USER)

		const { data, status } = await api.permesso.put(
			{ practiceNumber: 'AB12345678' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(200)
		expect(PermessoStatusResponseSchema.parse(data).practiceNumber).toBe(
			'AB12345678',
		)

		const { data: getData } = await api.permesso.get({
			headers: authHeaders(token),
		})
		expect(PermessoStatusResponseSchema.parse(getData).practiceNumber).toBe(
			'AB12345678',
		)
	})

	it('resets lastStatus/lastError/lastCheckedAt to null when called again on an existing row', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		await api.permesso.put(
			{ practiceNumber: 'AB12345678' },
			{ headers: authHeaders(token) },
		)

		// Seed a prior check result directly through the repository so the row
		// has non-null lastStatus/lastError/lastCheckedAt before we re-set the
		// practice number below.
		await permessoRepository.recordCheckResult(
			userId,
			{ success: true, status: 'In lavorazione' },
			'manual',
		)
		const seeded = await getSubscriptionRow(userId)
		expect(seeded?.lastStatus).toBe('In lavorazione')
		expect(seeded?.lastCheckedAt).not.toBeNull()

		const { data, status } = await api.permesso.put(
			{ practiceNumber: 'CD98765432' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(200)
		const parsed = PermessoStatusResponseSchema.parse(data)
		expect(parsed.practiceNumber).toBe('CD98765432')
		expect(parsed.lastStatus).toBeNull()
		expect(parsed.lastError).toBeNull()
		expect(parsed.lastCheckedAt).toBeNull()

		const row = await getSubscriptionRow(userId)
		expect(row?.practiceNumber).toBe('CD98765432')
		expect(row?.lastStatus).toBeNull()
		expect(row?.lastError).toBeNull()
		expect(row?.lastCheckedAt).toBeNull()
	})
})

describe('GET /permesso', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api.permesso.get()
		expect(status).toBe(401)
	})

	it('returns the empty status for a fresh user', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api.permesso.get({
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

	it('reports telegramConnected: true once a chat is linked', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		await api.permesso.put(
			{ practiceNumber: 'AB12345678' },
			{ headers: authHeaders(token) },
		)

		await db
			.update(permessoSubscriptions)
			.set({ telegramChatId: '999999' })
			.where(eq(permessoSubscriptions.userId, userId))

		const { data, status } = await api.permesso.get({
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		expect(PermessoStatusResponseSchema.parse(data).telegramConnected).toBe(
			true,
		)
	})
})

describe('POST /permesso/check', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api.permesso.check.post()
		expect(status).toBe(401)
	})

	it('returns 409 when no practice number is set (no subscription row)', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api.permesso.check.post(undefined, {
			headers: authHeaders(token),
		})
		expect(status).toBe(409)
	})

	it('runs the check and records success — response shape, row update, history row', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		await api.permesso.put(
			{ practiceNumber: 'AB12345678' },
			{ headers: authHeaders(token) },
		)

		checkPermessoStatusMock.mockImplementationOnce(async () => ({
			success: true,
			status: 'Pratica in lavorazione',
		}))

		const { data, status } = await api.permesso.check.post(undefined, {
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const parsed = CheckResultResponseSchema.parse(data)
		expect(parsed.success).toBe(true)
		expect(parsed.status).toBe('Pratica in lavorazione')
		expect(parsed.error).toBeNull()

		const row = await getSubscriptionRow(userId)
		expect(row?.lastStatus).toBe('Pratica in lavorazione')
		expect(row?.lastError).toBeNull()
		expect(row?.lastCheckedAt).not.toBeNull()

		const historyRows = await db
			.select()
			.from(permessoChecks)
			.where(eq(permessoChecks.userId, userId))
		expect(historyRows).toHaveLength(1)
		expect(historyRows[0]?.triggeredBy).toBe('manual')
		expect(historyRows[0]?.success).toBe(true)
		expect(historyRows[0]?.status).toBe('Pratica in lavorazione')

		// No Telegram chat linked — no notification should be sent.
		expect(sendTelegramCheckResultMock).not.toHaveBeenCalled()
	})

	it('runs the check and records failure — lastError set, success: false', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		await api.permesso.put(
			{ practiceNumber: 'AB12345678' },
			{ headers: authHeaders(token) },
		)

		checkPermessoStatusMock.mockImplementationOnce(async () => ({
			success: false,
			error: 'portal timeout',
		}))

		const { data, status } = await api.permesso.check.post(undefined, {
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const parsed = CheckResultResponseSchema.parse(data)
		expect(parsed.success).toBe(false)
		expect(parsed.status).toBeNull()
		expect(parsed.error).toBe('portal timeout')

		const row = await getSubscriptionRow(userId)
		expect(row?.lastStatus).toBeNull()
		expect(row?.lastError).toBe('portal timeout')
	})

	it('sends a Telegram notification when a chat is linked', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		await api.permesso.put(
			{ practiceNumber: 'AB12345678' },
			{ headers: authHeaders(token) },
		)
		await db
			.update(permessoSubscriptions)
			.set({ telegramChatId: '999999' })
			.where(eq(permessoSubscriptions.userId, userId))

		checkPermessoStatusMock.mockImplementationOnce(async () => ({
			success: true,
			status: 'ready',
		}))

		await api.permesso.check.post(undefined, { headers: authHeaders(token) })

		expect(sendTelegramCheckResultMock).toHaveBeenCalledTimes(1)
		expect(sendTelegramCheckResultMock).toHaveBeenCalledWith(userId, '999999', {
			success: true,
			status: 'ready',
		})
	})

	it('does not send a Telegram notification when no chat is linked', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		await api.permesso.put(
			{ practiceNumber: 'AB12345678' },
			{ headers: authHeaders(token) },
		)

		await api.permesso.check.post(undefined, { headers: authHeaders(token) })

		expect(sendTelegramCheckResultMock).not.toHaveBeenCalled()
	})
})

describe('GET /permesso/history', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api.permesso.history.get()
		expect(status).toBe(401)
	})

	it('returns an empty array for a fresh user', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api.permesso.history.get({
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		expect(PermessoCheckHistoryResponseSchema.parse(data)).toEqual([])
	})

	it('returns at most 20 rows, newest first', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		await api.permesso.put(
			{ practiceNumber: 'AB12345678' },
			{ headers: authHeaders(token) },
		)

		const base = new Date()
		// 25 rows with strictly increasing checkedAt timestamps, one second apart.
		for (let i = 0; i < 25; i++) {
			await db.insert(permessoChecks).values({
				userId,
				success: true,
				status: `status-${i}`,
				triggeredBy: 'manual',
				checkedAt: addSeconds(base, i),
			})
		}

		const { data, status } = await api.permesso.history.get({
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const parsed = PermessoCheckHistoryResponseSchema.parse(data)
		expect(parsed).toHaveLength(20)
		// Newest first: status-24 down through status-5.
		expect(parsed[0]?.status).toBe('status-24')
		expect(parsed[19]?.status).toBe('status-5')
		const checkedAtTimes = parsed.map((row) =>
			parseISO(row.checkedAt).getTime(),
		)
		expect(checkedAtTimes).toEqual([...checkedAtTimes].sort((a, b) => b - a))
	})
})

describe('POST /permesso/telegram/link', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api.permesso.telegram.link.post()
		expect(status).toBe(401)
	})

	it('returns 409 when no practice number is set', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api.permesso.telegram.link.post(undefined, {
			headers: authHeaders(token),
		})
		expect(status).toBe(409)
	})

	it('returns 503 when the Telegram bot is not configured', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		await api.permesso.put(
			{ practiceNumber: 'AB12345678' },
			{ headers: authHeaders(token) },
		)

		// startTelegramBot() is only ever invoked from src/index.ts (never from
		// the `app` under test here), so buildTelegramDeepLink's default mock
		// behaviour above mirrors what the real, never-started module would do —
		// this confirms the route surfaces that as a 503.
		const { status } = await api.permesso.telegram.link.post(undefined, {
			headers: authHeaders(token),
		})
		expect(status).toBe(503)
	})

	it('persists the link token and returns the deep link on success', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		await api.permesso.put(
			{ practiceNumber: 'AB12345678' },
			{ headers: authHeaders(token) },
		)

		buildTelegramDeepLinkMock.mockReturnValueOnce(
			'https://t.me/testbot?start=fake-token',
		)

		const { data, status } = await api.permesso.telegram.link.post(undefined, {
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		expect(TelegramLinkResponseSchema.parse(data).deepLink).toBe(
			'https://t.me/testbot?start=fake-token',
		)

		const row = await getSubscriptionRow(userId)
		expect(row?.telegramLinkToken).not.toBeNull()
	})
})

describe('POST /permesso/telegram/disconnect', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api.permesso.telegram.disconnect.post()
		expect(status).toBe(401)
	})

	it('clears telegramChatId and telegramLinkToken on an existing row', async () => {
		const { token, userId } = await registerAndGetToken(VALID_USER)
		await api.permesso.put(
			{ practiceNumber: 'AB12345678' },
			{ headers: authHeaders(token) },
		)
		await db
			.update(permessoSubscriptions)
			.set({ telegramChatId: '999999', telegramLinkToken: 'pending-token' })
			.where(eq(permessoSubscriptions.userId, userId))

		const { data, status } = await api.permesso.telegram.disconnect.post(
			undefined,
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(200)
		expect(PermessoStatusResponseSchema.parse(data).telegramConnected).toBe(
			false,
		)

		const row = await getSubscriptionRow(userId)
		expect(row?.telegramChatId).toBeNull()
		expect(row?.telegramLinkToken).toBeNull()
	})

	it('is a no-op that still returns 200 when there is no subscription row', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api.permesso.telegram.disconnect.post(
			undefined,
			{ headers: authHeaders(token) },
		)
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
