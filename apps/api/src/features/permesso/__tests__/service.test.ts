import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { db } from '@db'
import { permessoSubscriptions } from '@db/schema'
import { eq } from 'drizzle-orm'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { permessoRepository } from '../repository'
import { permessoService } from '../service'
import {
	notifyTelegramLinked,
	startTelegramLinkListener,
} from '../telegram-link-events'
import { clearFixtureMocks, registerAndGetToken, VALID_USER } from './fixtures'

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
	// Opens this process's own LISTEN connection so notifyTelegramLinked's
	// NOTIFY (below) round-trips back to it — in production this is opened
	// once at boot (src/index.ts), never by the test app.
	await startTelegramLinkListener()
})

afterEach(async () => {
	await cleanDatabase()
	clearFixtureMocks()
})

describe('permessoService.streamTelegramLinkEvents', () => {
	it('yields only "connected" when a Telegram chat is already linked', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		await permessoRepository.upsertPracticeNumber(userId, 'AB12345678')
		await db
			.update(permessoSubscriptions)
			.set({ telegramChatId: '999999' })
			.where(eq(permessoSubscriptions.userId, userId))

		const events = []
		for await (const evt of permessoService.streamTelegramLinkEvents(userId)) {
			events.push(evt)
		}

		expect(events).toEqual([{ event: 'connected' }])
	})

	it('yields "open" then "connected" once notifyTelegramLinked fires mid-poll', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		await permessoRepository.upsertPracticeNumber(userId, 'AB12345678')

		const generator = permessoService.streamTelegramLinkEvents(userId, {
			timeoutMs: 5_000,
			heartbeatMs: 2_000,
		})

		const open = await generator.next()
		expect(open.value).toEqual({ event: 'open' })

		// By now the loop's first waitForTelegramLinkOrHeartbeat() call has
		// already registered its listener (it does so synchronously before its
		// own first await), so this NOTIFY won't be missed.
		const next = generator.next()
		notifyTelegramLinked(userId)

		const linked = await next
		expect(linked.value).toEqual({ event: 'connected' })
		expect(linked.done).toBe(false)

		const final = await generator.next()
		expect(final.done).toBe(true)
	})

	it('yields "open", then "ping" on every heartbeat, then "timeout" when nobody links', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		await permessoRepository.upsertPracticeNumber(userId, 'AB12345678')

		const events = []
		for await (const evt of permessoService.streamTelegramLinkEvents(userId, {
			timeoutMs: 120,
			heartbeatMs: 50,
		})) {
			events.push(evt)
		}

		expect(events[0]).toEqual({ event: 'open' })
		expect(events.at(-1)).toEqual({ event: 'timeout' })
		expect(events.slice(1, -1)).toEqual(
			events.slice(1, -1).map(() => ({ event: 'ping' })),
		)
		expect(events.length).toBeGreaterThan(2)
	})
})
