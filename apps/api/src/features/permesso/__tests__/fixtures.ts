import { mock } from 'bun:test'
import { db } from '@db'
import { permessoSubscriptions } from '@db/schema'
import { treaty } from '@elysiajs/eden'
import type { RegisterRequest } from 'contracts'
import { AuthResponseSchema } from 'contracts'
import { eq } from 'drizzle-orm'
import { app } from '@/app'
import type { PermessoCheckResult } from '../checker'

// ---------------------------------------------------------------------------
// Eden Treaty client
// ---------------------------------------------------------------------------

// parseDate: false — Eden Treaty otherwise auto-converts ISO-date-looking
// JSON strings back into `Date` instances on the client, which breaks the
// permesso contracts' `z.string()` date fields (checkedAt, lastCheckedAt)
// the moment a test asserts against a non-null value. Disabling it keeps
// what these tests see equal to the real wire format (JSON always sends
// strings), matching what the contracts actually declare.
//
// Not exported: Eden's inferred client type isn't nameable outside this
// file (TS2883, since this is a composite project with declaration emit),
// and every other feature's test suite already instantiates its own local
// client rather than sharing one — registerAndGetToken below is the only
// thing here that needs it.
const api = treaty(app, { parseDate: false }).api.v1

// ---------------------------------------------------------------------------
// Module mocks
//
// checker.ts drives a real headless browser against the government portal
// and telegram-bot.ts talks to the real Telegram Bot API — neither should be
// hit by these tests. Both are mocked once at module scope; individual tests
// override behaviour with mockImplementationOnce/mockReturnValueOnce. Every
// test file that imports this module for its side effects gets the same
// mocks — bun:test's module registry is process-wide, so each file that
// touches `./checker` or `./telegram-bot` needs these in place before it
// imports anything that transitively imports them (routes.ts, service.ts,
// jobs.ts).
// ---------------------------------------------------------------------------

export const checkPermessoStatusMock = mock(
	async (_practiceNumber: string): Promise<PermessoCheckResult> => ({
		success: true,
		status: 'default mock status',
	}),
)
mock.module('../checker', () => ({
	checkPermessoStatus: checkPermessoStatusMock,
}))

export const sendTelegramCheckResultMock = mock(async () => {})
export const sendTelegramUnsubscribedNoticeMock = mock(async () => {})
// Mirrors the real module's behaviour when the bot was never started (as in
// this test process, which never calls startTelegramBot() through app
// startup) — no bot configured, so no deep link can be built.
export const buildTelegramDeepLinkMock = mock(
	(_linkToken: string): string | null => null,
)
mock.module('../telegram-bot', () => ({
	sendTelegramCheckResult: sendTelegramCheckResultMock,
	sendTelegramUnsubscribedNotice: sendTelegramUnsubscribedNoticeMock,
	buildTelegramDeepLink: buildTelegramDeepLinkMock,
	handleTelegramWebhook: mock(
		async () =>
			new Response('Telegram webhook not configured', { status: 503 }),
	),
	startTelegramBot: mock(async () => {}),
}))

export function clearFixtureMocks() {
	checkPermessoStatusMock.mockClear()
	sendTelegramCheckResultMock.mockClear()
	sendTelegramUnsubscribedNoticeMock.mockClear()
	buildTelegramDeepLinkMock.mockClear()
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const VALID_USER: RegisterRequest = {
	email: 'permesso@example.com',
	name: 'Permesso User',
	password: 'password123',
}

export async function registerAndGetToken(user: RegisterRequest) {
	const { data } = await api.auth.register.post(user)
	const auth = AuthResponseSchema.parse(data)
	return {
		token: auth.tokens.accessToken,
		userId: auth.user.id,
	}
}

export function authHeaders(token: string) {
	return { authorization: `Bearer ${token}` }
}

/** Reads the raw permesso_subscriptions row for a user directly via drizzle */
export async function getSubscriptionRow(userId: string) {
	const [row] = await db
		.select()
		.from(permessoSubscriptions)
		.where(eq(permessoSubscriptions.userId, userId))
	return row ?? null
}
