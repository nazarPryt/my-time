import { pushTimeSession } from './session-stream.mocks'
import { expect, test } from './time-tracker.fixtures'
import {
	API_TIME_DELETE,
	API_TIME_START,
	API_TIME_TODAY,
	MOCK_SESSION_ACTIVE,
	MOCK_TODAY_EMPTY,
	mockTimeActive,
	mockTimeDelete,
	mockTimeFailure,
	mockTimeStart,
	mockTimeToday,
} from './time-tracker.mocks'

test.describe('Time tracker failure recovery', () => {
	test('keeps an unsuccessful Start idle and allows retry', async ({
		page,
		timeTrackerPage,
	}) => {
		await timeTrackerPage.goto()
		await mockTimeFailure(page, API_TIME_START)
		await timeTrackerPage.start()
		await expect(timeTrackerPage.error).toBeVisible()
		await expect(timeTrackerPage.statusBadge).toHaveText('Ready')
		await expect(timeTrackerPage.timer).toHaveText('00:00')
		await expect(timeTrackerPage.startBtn).toBeEnabled()
		await mockTimeStart(page)
		await timeTrackerPage.start()
		await expect(timeTrackerPage.statusBadge).toHaveText('Working')
		await expect(timeTrackerPage.error).toBeHidden()
	})

	test('keeps a rejected deletion running and allows retry', async ({
		page,
		timeTrackerPage,
	}) => {
		await mockTimeActive(page, MOCK_SESSION_ACTIVE)
		await timeTrackerPage.goto()
		await mockTimeFailure(page, API_TIME_DELETE)
		await timeTrackerPage.confirmDelete()
		await expect(timeTrackerPage.error).toBeVisible()
		await expect(timeTrackerPage.statusBadge).toHaveText('Working')
		await expect(timeTrackerPage.deleteTrigger).toBeEnabled()
		await mockTimeDelete(page)
		await timeTrackerPage.confirmDelete()
		await expect(timeTrackerPage.statusBadge).toHaveText('Ready')
		await expect(timeTrackerPage.error).toBeHidden()
	})

	test('retains confirmed statistics on read failure and recovers on the next snapshot', async ({
		page,
		timeTrackerPage,
	}) => {
		await timeTrackerPage.goto()
		await expect(timeTrackerPage.statToday).toHaveText('2h')
		await mockTimeFailure(page, API_TIME_TODAY)
		pushTimeSession(page, MOCK_SESSION_ACTIVE)
		await expect(timeTrackerPage.error).toContainText('Unable to refresh today')
		await expect(timeTrackerPage.statusBadge).toHaveText('Working')
		await expect(timeTrackerPage.statToday).toHaveText('2h')
		await expect(timeTrackerPage.sessionRows).toHaveCount(3)
		await mockTimeToday(page, MOCK_TODAY_EMPTY)
		pushTimeSession(page, null)
		await expect(timeTrackerPage.error).toBeHidden()
		await expect(timeTrackerPage.statToday).toHaveText('0s')
		await expect(timeTrackerPage.sessionRows).toHaveCount(0)
	})
})
