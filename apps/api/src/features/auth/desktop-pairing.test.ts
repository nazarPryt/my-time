import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { db } from '@db'
import { desktopPairings } from '@db/schema'
import { treaty } from '@elysiajs/eden'
import { subMinutes, subSeconds } from 'date-fns'
import { eq } from 'drizzle-orm'
import { app } from '@/app'
import { cleanDatabase, runMigrations } from '@/test/setup'

const auth = treaty(app).api.v1.auth
const pairing = auth['desktop-pairing']
beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})
afterEach(cleanDatabase)
async function start() {
	const result = await pairing.start.post()
	expect(result.status).toBe(200)
	if (!result.data) throw new Error('Expected pairing request')
	return result.data
}
async function register(email = 'desktop@example.com') {
	const result = await auth.register.post({
		email,
		name: 'Desktop test',
		password: 'password123',
	})
	if (!result.data) throw new Error('Expected user')
	return { authorization: `Bearer ${result.data.tokens.accessToken}` }
}
async function allowPoll(id: string) {
	await db
		.update(desktopPairings)
		.set({ nextPollAt: subSeconds(new Date(), 1) })
		.where(eq(desktopPairings.id, id))
}

describe('desktop browser sign-in', () => {
	it('requires web authentication to inspect or approve a request', async () => {
		const request = await start()
		expect(
			(await pairing.info.post({ requestId: request.requestId })).status,
		).toBe(401)
		expect(
			(await pairing.approve.post({ requestId: request.requestId })).status,
		).toBe(401)
	})
	it('stores only a hash of the device secret and exposes no tokens to the web', async () => {
		const request = await start()
		const [row] = await db.select().from(desktopPairings)
		expect(row.secretHash).not.toBe(request.deviceSecret)
		const info = await pairing.info.post(
			{ requestId: request.requestId },
			{ headers: await register() },
		)
		expect(info.data).toEqual({ confirmationCode: request.confirmationCode })
	})
	it('waits for approval and enforces the polling interval', async () => {
		const request = await start()
		const body = {
			requestId: request.requestId,
			deviceSecret: request.deviceSecret,
		}
		expect((await pairing.poll.post(body)).data).toEqual({
			status: 'slow_down',
		})
		await allowPoll(request.requestId)
		expect((await pairing.poll.post(body)).data).toEqual({ status: 'pending' })
		expect((await pairing.poll.post(body)).data).toEqual({
			status: 'slow_down',
		})
	})
	it('only the requesting desktop can redeem approval, exactly once even concurrently', async () => {
		const request = await start()
		const approved = await pairing.approve.post(
			{ requestId: request.requestId },
			{ headers: await register() },
		)
		expect(approved.status).toBe(200)
		await allowPoll(request.requestId)
		expect(
			(
				await pairing.poll.post({
					requestId: request.requestId,
					deviceSecret: '0'.repeat(64),
				})
			).data,
		).toEqual({ status: 'expired' })
		const results = await Promise.all([
			pairing.poll.post({
				requestId: request.requestId,
				deviceSecret: request.deviceSecret,
			}),
			pairing.poll.post({
				requestId: request.requestId,
				deviceSecret: request.deviceSecret,
			}),
		])
		const connected = results.filter(
			(result) => result.data?.status === 'connected',
		)
		expect(connected).toHaveLength(1)
		expect(
			results.filter((result) => result.data?.status === 'expired'),
		).toHaveLength(1)
		const data = connected[0].data
		if (data?.status !== 'connected') throw new Error('Expected connected')
		expect(data.email).toBe('desktop@example.com')
		expect(
			(
				await auth.me.get({
					headers: { authorization: `Bearer ${data.tokens.accessToken}` },
				})
			).status,
		).toBe(200)
		expect(
			(
				await auth['refresh-extension'].post({
					refreshToken: data.tokens.refreshToken,
				})
			).status,
		).toBe(200)
	})
	it('cannot reassign an approved request to another account', async () => {
		const request = await start()
		const first = await register()
		const second = await register('other@example.com')
		expect(
			(
				await pairing.approve.post(
					{ requestId: request.requestId },
					{ headers: first },
				)
			).status,
		).toBe(200)
		expect(
			(
				await pairing.approve.post(
					{ requestId: request.requestId },
					{ headers: second },
				)
			).status,
		).toBe(404)
	})
	it('rejects expired requests and limits anonymous creation', async () => {
		const expired = await start()
		await db
			.update(desktopPairings)
			.set({ expiresAt: subMinutes(new Date(), 1) })
			.where(eq(desktopPairings.id, expired.requestId))
		expect(
			(
				await pairing.approve.post(
					{ requestId: expired.requestId },
					{ headers: await register() },
				)
			).status,
		).toBe(404)
		expect(
			(
				await pairing.poll.post({
					requestId: expired.requestId,
					deviceSecret: expired.deviceSecret,
				})
			).data,
		).toEqual({ status: 'expired' })
		for (let index = 0; index < 5; index++) await start()
		expect((await pairing.start.post()).status).toBe(429)
	})
})
