import {
	afterEach,
	beforeAll,
	describe,
	expect,
	it,
	mock,
	spyOn,
} from 'bun:test'
import { db } from '@db'
import { permessoChecks, permessoSubscriptions } from '@db/schema'
import { treaty } from '@elysiajs/eden'
import type { RegisterRequest } from 'contracts'
import {
	AuthResponseSchema,
	CheckResultResponseSchema,
	PermessoCheckHistoryResponseSchema,
	PermessoStatusResponseSchema,
	TelegramLinkResponseSchema,
} from 'contracts'
import { addSeconds, parseISO } from 'date-fns'
import { eq } from 'drizzle-orm'
import { app } from '@/app'
import { cleanDatabase, runMigrations } from '@/test/setup'
import type { PermessoCheckResult } from './checker'
import { getHourInTimeZone, runScheduledChecks } from './jobs'
import { permessoRepository } from './repository'

// ---------------------------------------------------------------------------
// Eden Treaty client
// ---------------------------------------------------------------------------

// parseDate: false — Eden Treaty otherwise auto-converts ISO-date-looking
// JSON strings back into `Date` instances on the client, which breaks the
// permesso contracts' `z.string()` date fields (checkedAt, lastCheckedAt)
// the moment a test asserts against a non-null value. Disabling it keeps
// what these tests see equal to the real wire format (JSON always sends
// strings), matching what the contracts actually declare.
const api = treaty(app, { parseDate: false }).api.v1

// ---------------------------------------------------------------------------
// Module mocks
//
// checker.ts drives a real headless browser against the government portal
// and telegram-bot.ts talks to the real Telegram Bot API — neither should be
// hit by these tests. Both are mocked once at module scope; individual tests
// override behaviour with mockImplementationOnce/mockReturnValueOnce and the
// shared afterEach below clears call history so mocks don't leak between
// tests. Real references to telegram-bot's exports are captured *before* the
// module is mocked, so the isolated 403-handling test further down can still
// exercise the actual implementation.
// ---------------------------------------------------------------------------

const { TelegramApiError: RealTelegramApiError } = await import(
	'node-telegram-bot-api'
)
const realTelegramBot = await import('./telegram-bot')
const realStartTelegramBot = realTelegramBot.startTelegramBot
const realSendTelegramCheckResult = realTelegramBot.sendTelegramCheckResult

const checkPermessoStatusMock = mock(
	async (_practiceNumber: string): Promise<PermessoCheckResult> => ({
		success: true,
		status: 'default mock status',
	}),
)
mock.module('./checker', () => ({
	checkPermessoStatus: checkPermessoStatusMock,
}))

const sendTelegramCheckResultMock = mock(async () => {})
const sendTelegramUnsubscribedNoticeMock = mock(async () => {})
// Mirrors the real module's behaviour when the bot was never started (as in
// this test process, which never calls startTelegramBot() through app
// startup) — no bot configured, so no deep link can be built.
const buildTelegramDeepLinkMock = mock(
	(_linkToken: string): string | null => null,
)
mock.module('./telegram-bot', () => ({
	sendTelegramCheckResult: sendTelegramCheckResultMock,
	sendTelegramUnsubscribedNotice: sendTelegramUnsubscribedNoticeMock,
	buildTelegramDeepLink: buildTelegramDeepLinkMock,
	handleTelegramWebhook: mock(
		async () =>
			new Response('Telegram webhook not configured', { status: 503 }),
	),
	startTelegramBot: mock(async () => {}),
}))

// Used only by the isolated 403-handling test — throws the real
// TelegramApiError class so telegram-bot.ts's `instanceof` check matches.
const fakeSendMessage = mock(async () => {
	throw new RealTelegramApiError(403, 'Forbidden: bot was blocked by the user')
})
class FakeBot {
	api = {
		getMe: async () => ({ username: 'test_bot' }),
		sendMessage: fakeSendMessage,
	}
	command(..._args: unknown[]) {}
	startPolling() {
		return Promise.resolve()
	}
}
mock.module('node-telegram-bot-api', () => ({
	Bot: FakeBot,
	TelegramApiError: RealTelegramApiError,
	webhookCallback: mock(() => async () => new Response()),
}))

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
	checkPermessoStatusMock.mockClear()
	sendTelegramCheckResultMock.mockClear()
	sendTelegramUnsubscribedNoticeMock.mockClear()
	buildTelegramDeepLinkMock.mockClear()
	fakeSendMessage.mockClear()
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
// PUT /permesso (practice number)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// GET /permesso
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// POST /permesso/check
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// GET /permesso/history
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// POST /permesso/telegram/link
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// POST /permesso/telegram/disconnect
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// permessoRepository — unit tests (no HTTP layer, real test DB)
// ---------------------------------------------------------------------------

describe('permessoRepository', () => {
	describe('upsertPracticeNumber', () => {
		it('inserts a new row on the first call', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)

			const row = await permessoRepository.upsertPracticeNumber(
				userId,
				'AB12345678',
			)
			expect(row.practiceNumber).toBe('AB12345678')
			expect(row.lastStatus).toBeNull()
		})

		it('updates practiceNumber and resets lastStatus/lastError/lastCheckedAt on conflict', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await permessoRepository.upsertPracticeNumber(userId, 'AB12345678')
			await permessoRepository.recordCheckResult(
				userId,
				{ success: false, error: 'boom' },
				'manual',
			)
			const seeded = await getSubscriptionRow(userId)
			expect(seeded?.lastError).toBe('boom')
			expect(seeded?.lastCheckedAt).not.toBeNull()

			const updated = await permessoRepository.upsertPracticeNumber(
				userId,
				'CD98765432',
			)
			expect(updated.practiceNumber).toBe('CD98765432')
			expect(updated.lastStatus).toBeNull()
			expect(updated.lastError).toBeNull()
			expect(updated.lastCheckedAt).toBeNull()
		})
	})

	describe('linkTelegramChat', () => {
		it('is single-use — a second call with the same (now-cleared) token returns null', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await permessoRepository.upsertPracticeNumber(userId, 'AB12345678')
			await permessoRepository.setTelegramLinkToken(userId, 'one-time-token')

			const first = await permessoRepository.linkTelegramChat(
				'one-time-token',
				'111',
			)
			expect(first?.telegramChatId).toBe('111')
			expect(first?.telegramLinkToken).toBeNull()

			const second = await permessoRepository.linkTelegramChat(
				'one-time-token',
				'222',
			)
			expect(second).toBeNull()

			// The chat linked by the first (successful) call is untouched.
			const row = await getSubscriptionRow(userId)
			expect(row?.telegramChatId).toBe('111')
		})
	})

	describe('recordCheckResult', () => {
		it('updates the subscription row and inserts a history row from one call', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await permessoRepository.upsertPracticeNumber(userId, 'AB12345678')

			await permessoRepository.recordCheckResult(
				userId,
				{ success: true, status: 'Pratica pronta' },
				'scheduled',
			)

			const row = await getSubscriptionRow(userId)
			expect(row?.lastStatus).toBe('Pratica pronta')
			expect(row?.lastError).toBeNull()
			expect(row?.lastCheckedAt).not.toBeNull()

			const historyRows = await db
				.select()
				.from(permessoChecks)
				.where(eq(permessoChecks.userId, userId))
			expect(historyRows).toHaveLength(1)
			expect(historyRows[0]?.success).toBe(true)
			expect(historyRows[0]?.status).toBe('Pratica pronta')
			expect(historyRows[0]?.triggeredBy).toBe('scheduled')
		})
	})
})

// ---------------------------------------------------------------------------
// telegram-bot.sendTelegramCheckResult — 403 (blocked bot) handling
//
// Exercises the *real* implementation (captured before ./telegram-bot was
// mocked wholesale above) against a fake node-telegram-bot-api Bot, since the
// real SDK would otherwise make a genuine network call. startTelegramBot()
// is normally only invoked once from src/index.ts at boot — calling it here
// directly is the least invasive way to populate telegram-bot.ts's
// module-private `bot` variable without exporting it just for tests.
// ---------------------------------------------------------------------------

describe('telegram-bot.sendTelegramCheckResult (real implementation)', () => {
	it('disconnects the user when Telegram reports the bot was blocked (403)', async () => {
		await realStartTelegramBot()

		const { userId } = await registerAndGetToken(VALID_USER)
		await permessoRepository.upsertPracticeNumber(userId, 'AB12345678')
		await db
			.update(permessoSubscriptions)
			.set({ telegramChatId: '424242' })
			.where(eq(permessoSubscriptions.userId, userId))

		await realSendTelegramCheckResult(userId, '424242', {
			success: true,
			status: 'ready',
		})

		expect(fakeSendMessage).toHaveBeenCalledTimes(1)
		const row = await getSubscriptionRow(userId)
		expect(row?.telegramChatId).toBeNull()
	})
})

// ---------------------------------------------------------------------------
// jobs.runScheduledChecks
// ---------------------------------------------------------------------------

describe('runScheduledChecks', () => {
	it('checks only subscriptions whose current local hour is due, tags them scheduled, and only notifies linked chats', async () => {
		const now = new Date()

		// Computed from the real current time rather than hardcoded UTC-relative
		// hours, so this test can't go flaky depending on when it runs.
		const dueHourUtc = getHourInTimeZone(now, 'UTC')
		const dueHourTokyo = getHourInTimeZone(now, 'Asia/Tokyo')
		// Guaranteed to differ from dueHourUtc regardless of current time.
		const notDueHourUtc = (dueHourUtc + 12) % 24

		const baseRow = {
			id: 'sub-1',
			userId: 'user-1',
			practiceNumber: 'AB12345678',
			checkHours: [dueHourUtc],
			timezone: 'UTC',
			telegramChatId: '111' as string | null,
			telegramLinkToken: null,
			lastStatus: null,
			lastError: null,
			lastCheckedAt: null,
			createdAt: now,
			updatedAt: now,
		}
		const dueRowWithTelegram = baseRow
		const dueRowNoTelegram = {
			...baseRow,
			id: 'sub-2',
			userId: 'user-2',
			checkHours: [dueHourTokyo],
			timezone: 'Asia/Tokyo',
			telegramChatId: null,
		}
		const notDueRow = {
			...baseRow,
			id: 'sub-3',
			userId: 'user-3',
			checkHours: [notDueHourUtc],
			timezone: 'UTC',
			telegramChatId: '333',
		}

		const listAllSpy = spyOn(permessoRepository, 'listAll').mockResolvedValue([
			dueRowWithTelegram,
			dueRowNoTelegram,
			notDueRow,
		])
		const recordCheckResultSpy = spyOn(
			permessoRepository,
			'recordCheckResult',
		).mockResolvedValue(undefined)

		try {
			await runScheduledChecks()

			expect(listAllSpy).toHaveBeenCalledTimes(1)
			// Only the two "due" subscriptions were checked — the mock's default
			// implementation ({ success: true, status: 'default mock status' })
			// applies since no per-test override was queued.
			expect(checkPermessoStatusMock).toHaveBeenCalledTimes(2)
			expect(recordCheckResultSpy).toHaveBeenCalledTimes(2)
			expect(recordCheckResultSpy).toHaveBeenCalledWith(
				'user-1',
				{ success: true, status: 'default mock status' },
				'scheduled',
			)
			expect(recordCheckResultSpy).toHaveBeenCalledWith(
				'user-2',
				{ success: true, status: 'default mock status' },
				'scheduled',
			)
			expect(recordCheckResultSpy).not.toHaveBeenCalledWith(
				'user-3',
				expect.anything(),
				'scheduled',
			)

			// Telegram is only sent for the subscription with a linked chat.
			expect(sendTelegramCheckResultMock).toHaveBeenCalledTimes(1)
			expect(sendTelegramCheckResultMock).toHaveBeenCalledWith(
				'user-1',
				'111',
				{ success: true, status: 'default mock status' },
			)
		} finally {
			listAllSpy.mockRestore()
			recordCheckResultSpy.mockRestore()
		}
	})
})
