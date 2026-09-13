import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { db } from '@db'
import { permessoChecks } from '@db/schema'
import { eq } from 'drizzle-orm'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { permessoRepository } from '../repository'
import {
	clearFixtureMocks,
	getSubscriptionRow,
	registerAndGetToken,
	VALID_USER,
} from './fixtures'

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})

afterEach(async () => {
	await cleanDatabase()
	clearFixtureMocks()
})

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
