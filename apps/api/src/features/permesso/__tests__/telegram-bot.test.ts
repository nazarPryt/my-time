import { afterEach, beforeAll, describe, expect, it, mock } from 'bun:test'
import { db } from '@db'
import { permessoSubscriptions } from '@db/schema'
import { treaty } from '@elysiajs/eden'
import type { RegisterRequest } from 'contracts'
import { AuthResponseSchema } from 'contracts'
import { eq } from 'drizzle-orm'
import { app } from '@/app'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { permessoRepository } from '../repository'

// ---------------------------------------------------------------------------
// Unlike every other permesso test file, this one exercises the REAL
// telegram-bot.ts implementation against a fake node-telegram-bot-api Bot
// (the real SDK would otherwise make a genuine network call). It must
// capture telegram-bot.ts's real exports *before* mocking anything and must
// NOT import fixtures.ts — that file mocks './telegram-bot' wholesale as a
// module-scope side effect, and since static imports fully evaluate before
// the importing module's own body runs, doing so here would mock
// telegram-bot.ts before this file's own code ever got a chance to capture
// the real implementation.
// ---------------------------------------------------------------------------

const { TelegramApiError: RealTelegramApiError } = await import(
	'node-telegram-bot-api'
)
const realTelegramBot = await import('../telegram-bot')
const realStartTelegramBot = realTelegramBot.startTelegramBot
const realSendTelegramCheckResult = realTelegramBot.sendTelegramCheckResult

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

const api = treaty(app, { parseDate: false }).api.v1

const VALID_USER: RegisterRequest = {
	email: 'permesso-telegram-bot@example.com',
	name: 'Permesso Telegram Bot User',
	password: 'password123',
}

async function registerAndGetToken(user: RegisterRequest) {
	const { data } = await api.auth.register.post(user)
	const auth = AuthResponseSchema.parse(data)
	return { token: auth.tokens.accessToken, userId: auth.user.id }
}

async function getSubscriptionRow(userId: string) {
	const [row] = await db
		.select()
		.from(permessoSubscriptions)
		.where(eq(permessoSubscriptions.userId, userId))
	return row ?? null
}

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})

afterEach(async () => {
	await cleanDatabase()
	fakeSendMessage.mockClear()
})

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
