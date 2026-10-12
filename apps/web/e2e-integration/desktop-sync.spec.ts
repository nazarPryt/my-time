import { API_PREFIX, TIME_TRACKER_ROUTES } from 'contracts'
import {
	API_URL,
	connectDesktop,
	createAccount,
	expect,
	test,
} from './desktop-sync.fixtures'

const TIMER_URL = `${API_URL}${API_PREFIX}${TIME_TRACKER_ROUTES.prefix}${TIME_TRACKER_ROUTES.timer}`

test('browser and desktop share commands, persisted history and backend totals', async ({
	page,
	request,
	account,
	desktop,
	trackerPage,
}) => {
	await trackerPage.goto()
	await expect.poll(async () => (await desktop.state()).status).toBe('ready')
	await trackerPage.start()
	await expect.poll(async () => (await desktop.state()).status).toBe('working')
	const sessionId = (await desktop.state()).activeSession?.id
	await expect
		.poll(async () => (await desktop.state()).dailySeconds)
		.toBeGreaterThan(0)
	await desktop.stop()
	await expect(trackerPage.startBtn).toBeVisible()
	await expect(trackerPage.statSessions).toContainText('1')
	await page.reload()
	await expect(trackerPage.sessionRows).toHaveCount(1)
	await desktop.start()
	await expect(trackerPage.stopBtn).toBeVisible()
	await expect
		.poll(async () => (await desktop.state()).activeSession?.id)
		.not.toBe(sessionId)
	await trackerPage.stop()
	await expect
		.poll(async () => (await desktop.state()).activeSession)
		.toBeNull()
	await expect(trackerPage.statSessions).toContainText('2')
	const response = await request.get(TIMER_URL, {
		headers: { Authorization: `Bearer ${account.accessToken}` },
	})
	const snapshot = await response.json()
	await expect
		.poll(async () => (await desktop.state()).dailySeconds)
		.toBe(Math.floor(snapshot.timer.dailyWorkSeconds))
})

test('desktop reconnect reconciles browser changes without duplicate sessions or account leakage', async ({
	request,
	account,
	desktop,
	trackerPage,
}) => {
	const otherAccount = await createAccount(request)
	const otherDesktop = await connectDesktop(request, otherAccount.credentials)
	const secondDesktop = await connectDesktop(request, account.credentials)
	try {
		await trackerPage.goto()
		await expect.poll(async () => (await desktop.state()).status).toBe('ready')
		await expect
			.poll(async () => (await otherDesktop.state()).status)
			.toBe('ready')
		await expect
			.poll(async () => (await secondDesktop.state()).status)
			.toBe('ready')
		await Promise.all([desktop.start(), secondDesktop.start()])
		await expect(trackerPage.stopBtn).toBeVisible()
		await expect(trackerPage.sessionRows).toHaveCount(1)
		await expect
			.poll(async () => (await secondDesktop.state()).activeSession?.id)
			.toBe((await desktop.state()).activeSession?.id)
		const sharedSessionId = (await desktop.state()).activeSession?.id
		await otherDesktop.start()
		await expect
			.poll(async () => (await otherDesktop.state()).status)
			.toBe('working')
		const otherSessionId = (await otherDesktop.state()).activeSession?.id
		expect(otherSessionId).toBeTruthy()
		expect(otherSessionId).not.toBe(sharedSessionId)
		await expect
			.poll(async () => (await desktop.state()).activeSession?.id)
			.toBe(sharedSessionId)
		await expect
			.poll(async () => (await secondDesktop.state()).activeSession?.id)
			.toBe(sharedSessionId)
		await desktop.disconnect()
		await expect
			.poll(async () => (await desktop.state()).status)
			.toBe('offline')
		await trackerPage.stop()
		await expect(trackerPage.startBtn).toBeVisible()
		await desktop.resume()
		await expect
			.poll(async () => (await desktop.state()).activeSession)
			.toBeNull()
		await expect.poll(async () => (await desktop.state()).status).toBe('ready')
		await expect(trackerPage.statSessions).toContainText('1')
		await expect
			.poll(async () => (await otherDesktop.state()).activeSession?.id)
			.toBe(otherSessionId)
		await expect
			.poll(async () => (await otherDesktop.state()).status)
			.toBe('working')
	} finally {
		await otherDesktop.stop()
		await otherDesktop.dispose()
		await secondDesktop.dispose()
	}
})
