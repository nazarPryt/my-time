import { afterEach, beforeAll, describe, expect, it, spyOn } from 'bun:test'
import { db } from '@db'
import { desktopPresence } from '@db/schema'
import { DesktopPresenceSchema } from 'contracts'
import { subSeconds } from 'date-fns'
import { eq } from 'drizzle-orm'
import { app } from '@/app'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { desktopPresenceService } from '../desktop-presence'
import { timeTrackerService } from '../service'
import { createSessionStream } from '../session-events'
import { OTHER_USER, registerAndGetToken, VALID_USER } from './fixtures'

const readers: ReadableStreamDefaultReader<Uint8Array>[] = []
const signals: AbortController[] = []
beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})
afterEach(async () => {
	for (const signal of signals.splice(0)) signal.abort()
	for (const reader of readers.splice(0)) await reader.cancel().catch(() => {})
	await cleanDatabase()
})
async function open(
	userId: string,
	kind: 'web' | 'desktop',
	lifetime = 60_000,
) {
	const signal = new AbortController()
	signals.push(signal)
	const response = await createSessionStream(
		userId,
		signal.signal,
		Date.now() + lifetime,
		kind,
	)
	const reader = response.body!.getReader()
	readers.push(reader)
	return reader
}
async function event(
	reader: ReadableStreamDefaultReader<Uint8Array>,
	name: string,
) {
	let timer: ReturnType<typeof setTimeout> | undefined
	try {
		return await Promise.race([
			(async () => {
				while (true) {
					const { done, value } = await reader.read()
					if (done) throw new Error('Stream ended')
					const text = new TextDecoder().decode(value)
					if (text.startsWith(`event: ${name}\n`))
						return JSON.parse(text.split('data: ')[1])
				}
			})(),
			new Promise<never>((_resolve, reject) => {
				timer = setTimeout(() => reject(new Error('Presence timeout')), 2000)
			}),
		])
	} finally {
		clearTimeout(timer)
	}
}
const presence = async (reader: ReadableStreamDefaultReader<Uint8Array>) =>
	DesktopPresenceSchema.parse(await event(reader, 'desktop-presence'))

describe('desktop connection presence', () => {
	it('reports existing desktops on initial web connection and keeps other accounts isolated', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		const { userId: other } = await registerAndGetToken(OTHER_USER)
		await open(userId, 'desktop')
		expect(await presence(await open(userId, 'web'))).toEqual({
			connected: true,
		})
		expect(await presence(await open(other, 'web'))).toEqual({
			connected: false,
		})
	})
	it('pushes connect and disconnect without rereading session state', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		const web = await open(userId, 'web')
		expect(await presence(web)).toEqual({ connected: false })
		const read = spyOn(timeTrackerService, 'getTimer')
		try {
			const desktop = await open(userId, 'desktop')
			await event(desktop, 'session-state')
			read.mockClear()
			expect(await presence(web)).toEqual({ connected: true })
			await desktop.cancel()
			expect(await presence(web)).toEqual({ connected: false })
			expect(read).not.toHaveBeenCalled()
		} finally {
			read.mockRestore()
		}
	})
	it('one desktop disconnecting cannot remove another live desktop', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		const first = await open(userId, 'desktop')
		const second = await open(userId, 'desktop')
		await first.cancel()
		expect(await desktopPresenceService.snapshot(userId)).not.toBeNull()
		await second.cancel()
		expect(await desktopPresenceService.snapshot(userId)).toBeNull()
	})
	it('expires crashed connections without waiting for a disconnect notification', async () => {
		const { userId } = await registerAndGetToken(VALID_USER)
		// A real stream records the lease expiry and schedules its next status check.
		const id = crypto.randomUUID()
		await desktopPresenceService.register(id, userId, Date.now() + 200)
		const web = await open(userId, 'web')
		expect(await presence(web)).toEqual({ connected: true })
		expect(await presence(web)).toEqual({ connected: false })
	})
	it('ignores expired leases and recognizes the already shipped desktop user agent', async () => {
		const { userId, token } = await registerAndGetToken(VALID_USER)
		const id = crypto.randomUUID()
		await desktopPresenceService.register(id, userId, Date.now() + 60_000)
		await db
			.update(desktopPresence)
			.set({ expiresAt: subSeconds(new Date(), 1) })
			.where(eq(desktopPresence.id, id))
		expect(await desktopPresenceService.snapshot(userId)).toBeNull()
		const signal = new AbortController()
		signals.push(signal)
		const response = await app.handle(
			new Request('http://localhost/api/v1/time-tracker/events', {
				headers: {
					authorization: `Bearer ${token}`,
					'user-agent': 'my-time-desktop/0.1.0',
				},
				signal: signal.signal,
			}),
		)
		expect(response.status).toBe(200)
		const reader = response.body!.getReader()
		readers.push(reader)
		await event(reader, 'session-state')
		expect(await desktopPresenceService.snapshot(userId)).not.toBeNull()
	})
})
