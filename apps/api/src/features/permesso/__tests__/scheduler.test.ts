import { afterEach, beforeAll, describe, expect, it, spyOn } from 'bun:test'
import { parseISO } from 'date-fns'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { getHourInTimeZone, runScheduledChecks } from '../jobs'
import { permessoRepository } from '../repository'
import {
	checkPermessoStatusMock,
	clearFixtureMocks,
	sendTelegramCheckResultMock,
} from './fixtures'

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})

afterEach(async () => {
	await cleanDatabase()
	clearFixtureMocks()
})

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
