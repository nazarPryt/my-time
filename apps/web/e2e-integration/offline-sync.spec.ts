import {
	API_PREFIX,
	TIME_TRACKER_ROUTES,
	TimerStateSchema,
	TodaySummaryResponseSchema,
	WeeklySummaryResponseSchema,
} from 'contracts'
import {
	differenceInMilliseconds,
	differenceInSeconds,
	formatISO,
	max,
	parseISO,
	subDays,
	subMinutes,
} from 'date-fns'
import { API_URL, createAccount } from './desktop-sync.fixtures'
import { expect, test } from './offline-sync.fixtures'

const TRACKER = `${API_URL}${API_PREFIX}${TIME_TRACKER_ROUTES.prefix}`

test('35 minutes offline survives a process restart, reaches the web, and is removed from the local queue', async ({
	request,
	account,
	offlineDesktop,
	trackerPage,
}) => {
	await trackerPage.goto()
	await expect
		.poll(async () => (await offlineDesktop.state()).status)
		.toBe('offline')
	const now = new Date()
	const start = subMinutes(now, 35)
	await offlineDesktop.setClock(start)
	await offlineDesktop.start()
	await offlineDesktop.setClock(now)
	await offlineDesktop.stop()
	const before = await offlineDesktop.state()
	expect(before.pending).toBe(1)
	const after = await offlineDesktop.restart()
	expect(after.pid).not.toBe(before.pid)
	expect(after.pending).toBe(1)
	expect(after.activeSession).toBeNull()
	await offlineDesktop.setOnline(true)
	await expect.poll(async () => (await offlineDesktop.state()).pending).toBe(0)
	await expect(trackerPage.sessionRows).toHaveCount(1)
	await expect(trackerPage.statSessions).toContainText('1')
	await expect(trackerPage.sessionDuration(0)).toHaveText('35m')
	const headers = { Authorization: `Bearer ${account.accessToken}` }
	const summary = TodaySummaryResponseSchema.parse(
		await (
			await request.get(`${TRACKER}${TIME_TRACKER_ROUTES.today}`, { headers })
		).json(),
	)
	expect(summary.sessions).toHaveLength(1)
	expect(summary.sessions[0]?.startedAt).toEqual(parseISO(formatISO(start)))
	expect(summary.sessions[0]?.endedAt).toEqual(parseISO(formatISO(now)))
	const timer = TimerStateSchema.parse(
		await (
			await request.get(`${TRACKER}${TIME_TRACKER_ROUTES.timer}`, { headers })
		).json(),
	)
	expect(timer.timer.dailyWorkSeconds).toBe(
		differenceInSeconds(
			parseISO(formatISO(now)),
			max([parseISO(formatISO(start)), timer.timer.dayStartedAt]),
		),
	)
	const cleaned = await offlineDesktop.restart()
	expect(cleaned.pending).toBe(0)
	await expect
		.poll(async () => (await offlineDesktop.state()).status)
		.toBe('ready')
	await expect(trackerPage.sessionRows).toHaveCount(1)
})

test('a running session survives a week offline and restart, including the time between processes', async ({
	request,
	account,
	offlineDesktop,
}) => {
	await expect
		.poll(async () => (await offlineDesktop.state()).status)
		.toBe('offline')
	const start = subDays(subMinutes(new Date(), 35), 7)
	await offlineDesktop.setClock(start)
	await offlineDesktop.start()
	const saved = await offlineDesktop.state()
	const end = new Date()
	await offlineDesktop.setClock(end)
	const restored = await offlineDesktop.restart()
	expect(restored.pid).not.toBe(saved.pid)
	expect(restored.journalRunning?.id).toBe(saved.journalRunning?.id)
	expect(restored.journalRunning?.startedAt).toEqual(
		saved.journalRunning?.startedAt,
	)
	expect(restored.pending).toBe(1)
	await offlineDesktop.stop()
	await offlineDesktop.setOnline(true)
	await expect.poll(async () => (await offlineDesktop.state()).pending).toBe(0)
	const headers = { Authorization: `Bearer ${account.accessToken}` }
	const weekly = WeeklySummaryResponseSchema.parse(
		await (
			await request.get(`${TRACKER}${TIME_TRACKER_ROUTES.weekly}`, { headers })
		).json(),
	)
	expect(weekly.days.reduce((sum, day) => sum + day.totalWorkSeconds, 0)).toBe(
		differenceInSeconds(parseISO(formatISO(end)), parseISO(formatISO(start))),
	)
	expect(
		weekly.days.filter((day) => day.totalWorkSeconds > 0).length,
	).toBeGreaterThanOrEqual(7)
	expect(
		TimerStateSchema.parse(
			await (
				await request.get(`${TRACKER}${TIME_TRACKER_ROUTES.timer}`, { headers })
			).json(),
		).activeSession,
	).toBeNull()
})

test('ongoing offline work becomes the active API session when reconnecting without a web session', async ({
	request,
	account,
	offlineDesktop,
	trackerPage,
}) => {
	await trackerPage.goto()
	await expect
		.poll(async () => (await offlineDesktop.state()).status)
		.toBe('offline')
	await offlineDesktop.start()
	const observation = (await offlineDesktop.state()).journalRunning
	expect(observation).toBeTruthy()
	await offlineDesktop.restart()
	await offlineDesktop.setOnline(true)
	await expect.poll(async () => (await offlineDesktop.state()).pending).toBe(0)
	await expect(trackerPage.stopBtn).toBeVisible()
	const headers = { Authorization: `Bearer ${account.accessToken}` }
	const state = TimerStateSchema.parse(
		await (
			await request.get(`${TRACKER}${TIME_TRACKER_ROUTES.timer}`, { headers })
		).json(),
	)
	expect(state.activeSession?.id).toBe(observation?.id)
	expect(state.activeSession?.startedAt).toEqual(observation?.startedAt)
	expect(state.timer.sessionWorkSeconds).toBeGreaterThanOrEqual(35 * 60)
	await offlineDesktop.stop()
	await expect(trackerPage.startBtn).toBeVisible()
	await expect(trackerPage.sessionRows).toHaveCount(1)
})

test('a committed upload with a lost response stays queued across restart and retries without duplicate history', async ({
	request,
	account,
	offlineDesktop,
	trackerPage,
}) => {
	await trackerPage.goto()
	await expect
		.poll(async () => (await offlineDesktop.state()).status)
		.toBe('offline')
	await offlineDesktop.start()
	await offlineDesktop.setClock(new Date())
	await offlineDesktop.stop()
	await offlineDesktop.loseNextResponse()
	await offlineDesktop.setOnline(true)
	await expect
		.poll(async () => (await offlineDesktop.state()).committedUploads)
		.toBe(1)
	await expect
		.poll(async () => (await offlineDesktop.state()).online)
		.toBe(false)
	expect((await offlineDesktop.state()).pending).toBe(1)
	await expect(trackerPage.sessionRows).toHaveCount(1)
	const first = TodaySummaryResponseSchema.parse(
		await (
			await request.get(`${TRACKER}${TIME_TRACKER_ROUTES.today}`, {
				headers: { Authorization: `Bearer ${account.accessToken}` },
			})
		).json(),
	)
	const restarted = await offlineDesktop.restart()
	expect(restarted.pending).toBe(1)
	await offlineDesktop.setOnline(true)
	await expect.poll(async () => (await offlineDesktop.state()).pending).toBe(0)
	const retried = TodaySummaryResponseSchema.parse(
		await (
			await request.get(`${TRACKER}${TIME_TRACKER_ROUTES.today}`, {
				headers: { Authorization: `Bearer ${account.accessToken}` },
			})
		).json(),
	)
	expect(retried.sessions).toHaveLength(1)
	expect(retried.sessions[0]?.id).toBe(first.sessions[0]?.id)
	expect(retried.totalWorkSeconds).toBe(first.totalWorkSeconds)
})

test('overlapping offline work is counted once and reconnect adopts the active web session', async ({
	request,
	account,
	offlineDesktop,
	trackerPage,
}) => {
	await trackerPage.goto()
	await expect
		.poll(async () => (await offlineDesktop.state()).status)
		.toBe('offline')
	await offlineDesktop.start()
	const observation = (await offlineDesktop.state()).journalRunning
	expect(observation).toBeTruthy()
	await trackerPage.start()
	await expect(trackerPage.stopBtn).toBeVisible()
	const headers = { Authorization: `Bearer ${account.accessToken}` }
	const web = TimerStateSchema.parse(
		await (
			await request.get(`${TRACKER}${TIME_TRACKER_ROUTES.timer}`, { headers })
		).json(),
	)
	await offlineDesktop.setOnline(true)
	await expect.poll(async () => (await offlineDesktop.state()).pending).toBe(0)
	await expect
		.poll(async () => (await offlineDesktop.state()).activeSession?.id)
		.toBe(web.activeSession?.id)
	await expect(trackerPage.sessionRows).toHaveCount(2)
	await trackerPage.stop()
	await expect
		.poll(async () => (await offlineDesktop.state()).activeSession)
		.toBeNull()
	const summary = TodaySummaryResponseSchema.parse(
		await (
			await request.get(`${TRACKER}${TIME_TRACKER_ROUTES.today}`, { headers })
		).json(),
	)
	expect(summary.sessions).toHaveLength(2)
	const until = max(
		summary.sessions.map((session) => session.endedAt ?? session.startedAt),
	)
	const from = max([
		observation?.startedAt ?? until,
		summary.timer?.dayStartedAt ?? until,
	])
	expect(summary.timer?.dailyWorkSeconds).toBeCloseTo(
		differenceInMilliseconds(until, from) / 1000,
		6,
	)
	const rawMilliseconds = summary.sessions.reduce(
		(total, session) =>
			total +
			differenceInMilliseconds(
				session.endedAt ?? session.startedAt,
				max([
					session.startedAt,
					summary.timer?.dayStartedAt ?? session.startedAt,
				]),
			),
		0,
	)
	expect(summary.timer?.dailyWorkSeconds).toBeLessThan(rawMilliseconds / 1000)
})

test('offline stops never stop a newer web session, and another account cannot see queued work', async ({
	request,
	account,
	offlineDesktop,
	trackerPage,
}) => {
	await trackerPage.goto()
	await offlineDesktop.setOnline(true)
	await expect
		.poll(async () => (await offlineDesktop.state()).status)
		.toBe('ready')
	await trackerPage.start()
	await expect
		.poll(async () => (await offlineDesktop.state()).status)
		.toBe('working')
	await offlineDesktop.setClock(new Date())
	await offlineDesktop.setOnline(false)
	await expect
		.poll(async () => (await offlineDesktop.state()).status)
		.toBe('offline')
	await trackerPage.stop()
	await trackerPage.start()
	await expect(trackerPage.stopBtn).toBeVisible()
	const headers = { Authorization: `Bearer ${account.accessToken}` }
	const newer = TimerStateSchema.parse(
		await (
			await request.get(`${TRACKER}${TIME_TRACKER_ROUTES.timer}`, { headers })
		).json(),
	)
	await offlineDesktop.setClock(new Date())
	await offlineDesktop.stop()
	const otherAccount = await createAccount(request)
	await offlineDesktop.switchAccount(otherAccount.credentials)
	expect((await offlineDesktop.state()).pending).toBe(0)
	const otherTimer = TimerStateSchema.parse(
		await (
			await request.get(`${TRACKER}${TIME_TRACKER_ROUTES.timer}`, {
				headers: { Authorization: `Bearer ${otherAccount.accessToken}` },
			})
		).json(),
	)
	expect(otherTimer.activeSession).toBeNull()
	expect(otherTimer.timer.dailyWorkSeconds).toBe(0)
	await offlineDesktop.switchAccount(account.credentials)
	expect((await offlineDesktop.state()).pending).toBe(1)
	await offlineDesktop.restart()
	await offlineDesktop.setOnline(true)
	await expect.poll(async () => (await offlineDesktop.state()).pending).toBe(0)
	await expect
		.poll(async () => (await offlineDesktop.state()).activeSession?.id)
		.toBe(newer.activeSession?.id)
	await expect(trackerPage.stopBtn).toBeVisible()
	await trackerPage.stop()
})
