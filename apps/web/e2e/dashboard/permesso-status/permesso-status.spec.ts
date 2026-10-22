import { PERMESSO_PATH } from './PermessoStatusPage'
import { expect, test } from './permesso-status.fixtures'
import {
	API_PERMESSO,
	API_PERMESSO_CHECK,
	API_PERMESSO_DISCONNECT,
	API_PERMESSO_LINK,
	API_PERMESSO_RESET,
	API_PERMESSO_SCHEDULE,
	MOCK_CHECK_RESULT,
	MOCK_CHECK_STATUS,
	MOCK_PERMESSO,
	MOCK_PERMESSO_CHECKED,
	MOCK_PERMESSO_EMPTY,
	MOCK_PERMESSO_HISTORY,
	MOCK_PRACTICE_NUMBER,
	MOCK_REPLACEMENT_NUMBER,
	MOCK_TELEGRAM_LINK,
	mockPermessoHistory,
	mockPermessoResponse,
	mockPermessoStatus,
	mockTelegramEvent,
} from './permesso-status.mocks'

test.describe('Permesso status', () => {
	test('first setup saves a practice number and unlocks checks and schedule', async ({
		page,
		permessoPage,
	}) => {
		await mockPermessoStatus(page, MOCK_PERMESSO_EMPTY)
		await mockPermessoResponse(page, API_PERMESSO, MOCK_PERMESSO, 200, 'PUT')
		await permessoPage.goto()
		await expect(permessoPage.checkButton).toHaveCount(0)
		await expect(permessoPage.schedule).toHaveCount(0)
		const request = page.waitForRequest((request) => request.method() === 'PUT')
		await permessoPage.savePracticeNumber(MOCK_PRACTICE_NUMBER)
		expect((await request).postDataJSON()).toEqual({
			practiceNumber: MOCK_PRACTICE_NUMBER,
		})
		await expect(permessoPage.checkButton).toBeEnabled()
		await expect(permessoPage.schedule).toBeVisible()
		await expect(permessoPage.historyEmpty).toBeVisible()
	})
	test('invalid practice number sends no mutation', async ({
		page,
		permessoPage,
	}) => {
		await mockPermessoStatus(page, MOCK_PERMESSO_EMPTY)
		let writes = 0
		page.on('request', (request) => {
			if (request.method() === 'PUT') writes++
		})
		await permessoPage.goto()
		await permessoPage.savePracticeNumber('invalid')
		await expect(permessoPage.practiceError).toBeVisible()
		expect(writes).toBe(0)
	})
	test('replacing the practice number requires confirmation and preserves history', async ({
		page,
		permessoPage,
	}) => {
		await mockPermessoHistory(page, MOCK_PERMESSO_HISTORY)
		await mockPermessoResponse(
			page,
			API_PERMESSO,
			{ ...MOCK_PERMESSO, practiceNumber: MOCK_REPLACEMENT_NUMBER },
			200,
			'PUT',
		)
		let writes = 0
		page.on('request', (request) => {
			if (request.method() === 'PUT') writes++
		})
		await permessoPage.goto()
		await permessoPage.savePracticeNumber(MOCK_REPLACEMENT_NUMBER)
		await expect(permessoPage.confirmDialog).toContainText(
			'Replace practice number?',
		)
		expect(writes).toBe(0)
		await permessoPage.confirmDialogCancelBtn.click()
		expect(writes).toBe(0)
		await permessoPage.practiceSave.click()
		await permessoPage.confirmDialogConfirmBtn.click()
		await expect(permessoPage.practiceInput).toHaveValue(
			MOCK_REPLACEMENT_NUMBER,
		)
		await expect(permessoPage.historyRows).toHaveCount(1)
		expect(writes).toBe(1)
	})
	test('practice save failure can be retried', async ({
		page,
		permessoPage,
	}) => {
		await mockPermessoStatus(page, MOCK_PERMESSO_EMPTY)
		await mockPermessoResponse(
			page,
			API_PERMESSO,
			{ message: 'Unavailable' },
			503,
			'PUT',
		)
		await permessoPage.goto()
		await permessoPage.savePracticeNumber(MOCK_PRACTICE_NUMBER)
		await expect(permessoPage.error).toHaveText('Invalid practice number')
		await expect(permessoPage.practiceSave).toBeEnabled()
		await mockPermessoResponse(page, API_PERMESSO, MOCK_PERMESSO, 200, 'PUT')
		await permessoPage.practiceSave.click()
		await expect(permessoPage.checkButton).toBeVisible()
		await expect(permessoPage.error).toHaveCount(0)
	})
	test('manual check refreshes status and history', async ({
		page,
		permessoPage,
	}) => {
		await permessoPage.goto()
		await expect(permessoPage.historyEmpty).toBeVisible()
		await mockPermessoStatus(page, MOCK_PERMESSO_CHECKED)
		await mockPermessoHistory(page, MOCK_PERMESSO_HISTORY)
		await mockPermessoResponse(page, API_PERMESSO_CHECK, MOCK_CHECK_RESULT)
		await permessoPage.checkButton.click()
		await expect(permessoPage.status).toContainText(MOCK_CHECK_STATUS)
		await expect(permessoPage.historyRows).toHaveCount(1)
		await expect(permessoPage.historyRows.first()).toContainText('Manual')
	})
	test('manual check failure preserves history and allows retry', async ({
		page,
		permessoPage,
	}) => {
		await mockPermessoStatus(page, MOCK_PERMESSO_CHECKED)
		await mockPermessoHistory(page, MOCK_PERMESSO_HISTORY)
		await mockPermessoResponse(
			page,
			API_PERMESSO_CHECK,
			{ message: 'Unavailable' },
			503,
		)
		await permessoPage.goto()
		await permessoPage.checkButton.click()
		await expect(permessoPage.error).toContainText('Check failed')
		await expect(permessoPage.historyRows).toHaveCount(1)
		await expect(permessoPage.checkButton).toBeEnabled()
		await mockPermessoResponse(page, API_PERMESSO_CHECK, MOCK_CHECK_RESULT)
		await permessoPage.checkButton.click()
		await expect(permessoPage.error).toHaveCount(0)
	})
	test('renders a failed scheduled check from history', async ({
		page,
		permessoPage,
	}) => {
		const lastError = 'Government portal unavailable'
		await mockPermessoStatus(page, { ...MOCK_PERMESSO, lastError })
		await mockPermessoHistory(page, [
			{
				...MOCK_PERMESSO_HISTORY[0],
				success: false,
				status: null,
				error: lastError,
				triggeredBy: 'scheduled',
			},
		])
		await permessoPage.goto()
		await expect(permessoPage.status).toContainText('Check failed')
		await expect(permessoPage.historyRows.first()).toContainText(lastError)
		await expect(permessoPage.historyRows.first()).toContainText('Scheduled')
	})
	test('confirms enabling an hour with timezone and turning it off', async ({
		page,
		permessoPage,
	}) => {
		await mockPermessoResponse(page, API_PERMESSO_SCHEDULE, {
			...MOCK_PERMESSO,
			checkHours: [9, 12],
		})
		await permessoPage.goto()
		await permessoPage.hour(12).click()
		await permessoPage.confirmDialogCancelBtn.click()
		await expect(permessoPage.hour(12)).toHaveAttribute('aria-pressed', 'false')
		const enabled = page.waitForRequest(API_PERMESSO_SCHEDULE)
		await permessoPage.hour(12).click()
		await permessoPage.confirmDialogConfirmBtn.click()
		const payload = (await enabled).postDataJSON()
		expect(payload.checkHours).toEqual([9, 12])
		expect(payload.timezone).toBe(
			await page.evaluate(
				() => Intl.DateTimeFormat().resolvedOptions().timeZone,
			),
		)
		await expect(permessoPage.hour(12)).toHaveAttribute('aria-pressed', 'true')
		await permessoPage.hour(12).click()
		await permessoPage.confirmDialogCancelBtn.click()
		await expect(permessoPage.hour(12)).toHaveAttribute('aria-pressed', 'true')
		await mockPermessoResponse(page, API_PERMESSO_SCHEDULE, MOCK_PERMESSO)
		const disabled = page.waitForRequest(API_PERMESSO_SCHEDULE)
		await permessoPage.hour(12).click()
		await permessoPage.confirmDialogConfirmBtn.click()
		expect((await disabled).postDataJSON().checkHours).toEqual([9])
		await expect(permessoPage.hour(12)).toHaveAttribute('aria-pressed', 'false')
	})
	test('failed schedule change preserves hours and can be retried', async ({
		page,
		permessoPage,
	}) => {
		await mockPermessoResponse(
			page,
			API_PERMESSO_SCHEDULE,
			{ message: 'Unavailable' },
			503,
		)
		await permessoPage.goto()
		await permessoPage.hour(12).click()
		await permessoPage.confirmDialogConfirmBtn.click()
		await expect(permessoPage.error).toHaveText('Failed to update schedule')
		await expect(permessoPage.hour(12)).toHaveAttribute('aria-pressed', 'false')
		await mockPermessoResponse(page, API_PERMESSO_SCHEDULE, {
			...MOCK_PERMESSO,
			checkHours: [9, 12],
		})
		await permessoPage.hour(12).click()
		await permessoPage.confirmDialogConfirmBtn.click()
		await expect(permessoPage.hour(12)).toHaveAttribute('aria-pressed', 'true')
		await expect(permessoPage.error).toHaveCount(0)
	})
	test('Telegram connection opens the returned link and applies its connected event', async ({
		page,
		context,
		permessoPage,
	}) => {
		// Intercept the popup before navigation; never contact Telegram during tests.
		await context.route(MOCK_TELEGRAM_LINK, (route) =>
			route.fulfill({
				body: '<html>Test Telegram</html>',
				contentType: 'text/html',
			}),
		)
		await mockPermessoResponse(page, API_PERMESSO_LINK, {
			deepLink: MOCK_TELEGRAM_LINK,
		})
		await mockTelegramEvent(page, 'connected')
		await permessoPage.goto()
		await expect(permessoPage.telegramStatus).toHaveText('Not connected')
		await mockPermessoStatus(page, {
			...MOCK_PERMESSO,
			telegramConnected: true,
		})
		const popup = context.waitForEvent('page')
		await permessoPage.telegramConnect.click()
		const telegram = await popup
		await expect(telegram).toHaveURL(MOCK_TELEGRAM_LINK)
		await expect(permessoPage.telegramStatus).toHaveText('Connected')
		await telegram.close()
	})
	test('Telegram link failure can be retried and timeout restores the connect button', async ({
		page,
		context,
		permessoPage,
	}) => {
		await mockPermessoResponse(
			page,
			API_PERMESSO_LINK,
			{ message: 'Unavailable' },
			503,
		)
		await permessoPage.goto()
		await permessoPage.telegramConnect.click()
		await expect(permessoPage.telegramError).toContainText('Could not start')
		await context.route(MOCK_TELEGRAM_LINK, (route) =>
			route.fulfill({ body: '' }),
		)
		await mockPermessoResponse(page, API_PERMESSO_LINK, {
			deepLink: MOCK_TELEGRAM_LINK,
		})
		await mockTelegramEvent(page, 'timeout')
		await permessoPage.telegramConnect.click()
		await expect(permessoPage.telegramStatus).toHaveText('Not connected')
		await expect(permessoPage.telegramConnect).toBeEnabled()
		await expect(permessoPage.telegramError).toHaveCount(0)
	})
	test('disconnecting Telegram requires confirmation and recovers after failure', async ({
		page,
		permessoPage,
	}) => {
		await mockPermessoStatus(page, {
			...MOCK_PERMESSO,
			telegramConnected: true,
		})
		await mockPermessoResponse(
			page,
			API_PERMESSO_DISCONNECT,
			{ message: 'Unavailable' },
			503,
		)
		await permessoPage.goto()
		let disconnects = 0
		page.on('request', (request) => {
			if (request.url().endsWith(API_PERMESSO_DISCONNECT.slice(2)))
				disconnects++
		})
		await permessoPage.telegramDisconnect.click()
		await permessoPage.confirmDialogCancelBtn.click()
		expect(disconnects).toBe(0)
		await permessoPage.telegramDisconnect.click()
		await permessoPage.confirmDialogConfirmBtn.click()
		await expect(permessoPage.telegramError).toHaveText(
			'Failed to disconnect Telegram',
		)
		await expect(permessoPage.telegramStatus).toHaveText('Connected')
		await mockPermessoResponse(page, API_PERMESSO_DISCONNECT, MOCK_PERMESSO)
		await permessoPage.telegramDisconnect.click()
		await permessoPage.confirmDialogConfirmBtn.click()
		await expect(permessoPage.telegramStatus).toHaveText('Not connected')
	})
	for (const stage of [1, 2]) {
		test(`cancelling reset confirmation ${stage} preserves data`, async ({
			page,
			permessoPage,
		}) => {
			let resets = 0
			page.on('request', (request) => {
				if (request.url().endsWith(API_PERMESSO_RESET.slice(2))) resets++
			})
			await permessoPage.goto()
			await permessoPage.openReset()
			if (stage === 2) {
				await permessoPage.confirmDialogConfirmBtn.click()
				await permessoPage.finalResetCancel.click()
			} else {
				await permessoPage.confirmDialogCancelBtn.click()
			}
			await expect(permessoPage.practiceInput).toHaveValue(MOCK_PRACTICE_NUMBER)
			expect(resets).toBe(0)
		})
	}
	test('reset clears data only after both confirmations', async ({
		page,
		permessoPage,
	}) => {
		await mockPermessoHistory(page, MOCK_PERMESSO_HISTORY)
		await mockPermessoResponse(page, API_PERMESSO_RESET, MOCK_PERMESSO_EMPTY)
		await permessoPage.goto()
		await permessoPage.confirmReset()
		await expect(permessoPage.practiceInput).toHaveValue('')
		await expect(permessoPage.historyRows).toHaveCount(0)
		await expect(permessoPage.checkButton).toHaveCount(0)
		await expect(permessoPage.schedule).toHaveCount(0)
	})
	test('failed reset preserves data and allows retry', async ({
		page,
		permessoPage,
	}) => {
		await mockPermessoHistory(page, MOCK_PERMESSO_HISTORY)
		await mockPermessoResponse(
			page,
			API_PERMESSO_RESET,
			{ message: 'Unavailable' },
			503,
		)
		await permessoPage.goto()
		await permessoPage.confirmReset()
		await expect(permessoPage.error).toHaveText(
			'Failed to delete permesso data',
		)
		await expect(permessoPage.practiceInput).toHaveValue(MOCK_PRACTICE_NUMBER)
		await expect(permessoPage.historyRows).toHaveCount(1)
		await mockPermessoResponse(page, API_PERMESSO_RESET, MOCK_PERMESSO_EMPTY)
		await permessoPage.confirmReset()
		await expect(permessoPage.practiceInput).toHaveValue('')
	})
	test('load failure shows an error and returning refetches status', async ({
		page,
		permessoPage,
	}) => {
		await mockPermessoResponse(
			page,
			API_PERMESSO,
			{ message: 'Unavailable' },
			503,
			'GET',
		)
		await permessoPage.goto()
		await expect(permessoPage.error).toHaveText(
			'Failed to load permesso status',
		)
		await mockPermessoStatus(page)
		await permessoPage.navLink('settings').click()
		await page.goto(PERMESSO_PATH)
		await expect(permessoPage.practiceInput).toHaveValue(MOCK_PRACTICE_NUMBER)
		await expect(permessoPage.error).toHaveCount(0)
	})
})
