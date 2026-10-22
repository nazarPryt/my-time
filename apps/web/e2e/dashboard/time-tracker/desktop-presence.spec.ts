import {
	failTimeEvents,
	pushDesktopPresence,
	recoverTimeEvents,
} from './session-stream.mocks'
import { expect, test } from './time-tracker.fixtures'

test('shows a synchronized badge for an existing desktop and hides the setup card', async ({
	page,
	timeTrackerPage,
}) => {
	pushDesktopPresence(page, true)
	await timeTrackerPage.goto()
	await expect(timeTrackerPage.desktopStatus).toHaveText(
		'Desktop connected · Synced',
	)
	await expect(timeTrackerPage.desktopStatus).toHaveAttribute(
		'data-variant',
		'success',
	)
	await expect(timeTrackerPage.desktopStatus).not.toHaveAttribute('href')
	await expect(timeTrackerPage.desktopSetup).toBeHidden()
	await page.setViewportSize({ width: 320, height: 720 })
	expect(
		await page.evaluate(() => document.documentElement.scrollWidth),
	).toBeLessThanOrEqual(320)
})

test('updates desktop status live on connect and disconnect', async ({
	page,
	timeTrackerPage,
}) => {
	await timeTrackerPage.goto()
	await expect(timeTrackerPage.desktopStatus).toHaveText(
		'Desktop not connected',
	)
	await expect(timeTrackerPage.desktopStatus).toHaveAttribute(
		'href',
		'/dashboard/time-tracker/desktop',
	)
	await expect(timeTrackerPage.desktopSetup).toBeHidden()
	pushDesktopPresence(page, true)
	await expect(timeTrackerPage.desktopStatus).toHaveText(
		'Desktop connected · Synced',
	)
	await expect(timeTrackerPage.desktopSetup).toBeHidden()
	pushDesktopPresence(page, false)
	await expect(timeTrackerPage.desktopStatus).toHaveText(
		'Desktop not connected',
	)
	await expect(timeTrackerPage.desktopSetup).toBeHidden()
})

test('does not claim synchronization when web loses its stream and recovers on reconnect', async ({
	page,
	timeTrackerPage,
}) => {
	pushDesktopPresence(page, true)
	await timeTrackerPage.goto()
	await expect(timeTrackerPage.desktopStatus).toHaveText(
		'Desktop connected · Synced',
	)
	failTimeEvents(page)
	await expect(timeTrackerPage.desktopStatus).toHaveText(
		'Desktop status unavailable',
	)
	await expect(timeTrackerPage.desktopSetup).toBeHidden()
	recoverTimeEvents(page, null)
	await expect(timeTrackerPage.desktopStatus).toHaveText(
		'Desktop connected · Synced',
	)
})

test('opens desktop setup only on demand and returns to the clean tracker on mobile', async ({
	page,
	timeTrackerPage,
}) => {
	await page.setViewportSize({ width: 375, height: 812 })
	await timeTrackerPage.goto()
	await expect(timeTrackerPage.desktopStatus).toHaveText(
		'Desktop not connected',
	)
	await expect(timeTrackerPage.desktopSetup).toBeHidden()
	await timeTrackerPage.desktopStatus.click()
	await expect(page).toHaveURL('/dashboard/time-tracker/desktop')
	await expect(timeTrackerPage.desktopSetup).toBeVisible()
	expect(
		await page.evaluate(() => document.documentElement.scrollWidth),
	).toBeLessThanOrEqual(375)
	await timeTrackerPage.desktopBack.click()
	await expect(page).toHaveURL('/dashboard/time-tracker')
	await expect(timeTrackerPage.timer).toBeVisible()
	await expect(timeTrackerPage.desktopSetup).toBeHidden()
})
