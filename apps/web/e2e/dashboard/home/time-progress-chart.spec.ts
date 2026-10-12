import { expect, test } from './home.fixtures'
import {
	holdTimeTrackerWeekly,
	MOCK_WEEKLY_WITH_SESSIONS,
	mockTimeTrackerWeekly,
	mockTimeTrackerWeeklyFailure,
} from './home.mocks'

test.describe('Work time chart on dashboard home', () => {
	test('shows loading until the summary resolves', async ({
		page,
		homePage,
	}) => {
		const held = await holdTimeTrackerWeekly(page)
		await homePage.goto()
		await expect(homePage.timeChartLoading).toBeVisible()
		await expect(homePage.timeChartEmpty).toBeHidden()
		held.release()
		await expect(homePage.timeChartLoading).toBeHidden()
		await expect(homePage.timeChartSummary).toHaveText(
			'2h 30m total · 2 active days',
		)
	})

	test('shows the empty state without a summary or bars', async ({
		homePage,
	}) => {
		await homePage.goto()
		await expect(homePage.timeChartEmpty).toHaveText(
			'No sessions in the last 30 days',
		)
		await expect(homePage.timeChartSummary).toHaveCount(0)
		await expect(homePage.timeChartBars).toHaveCount(0)
	})

	test('renders aggregate values and a daily duration tooltip', async ({
		page,
		homePage,
	}) => {
		await mockTimeTrackerWeekly(page, MOCK_WEEKLY_WITH_SESSIONS)
		await homePage.goto()
		await expect(homePage.timeChartSummary).toHaveText(
			'2h 30m total · 2 active days',
		)
		await expect(homePage.timeChartBars).toHaveCount(2)
		await homePage.timeChartBars.last().hover()
		await expect(homePage.timeChartTooltip).toContainText('Oct 12')
		await expect(homePage.timeChartTooltip).toContainText('1h 30m')
	})

	test('finishes loading on a failed read and recovers after revisiting', async ({
		page,
		homePage,
	}) => {
		await mockTimeTrackerWeeklyFailure(page)
		await homePage.goto()
		await expect(homePage.timeChartLoading).toBeHidden()
		// The current product uses the empty placeholder when no confirmed data exists.
		await expect(homePage.timeChartEmpty).toBeVisible()
		await homePage.navLink('settings').click()
		await expect(homePage.timeChart).toHaveCount(0)
		await mockTimeTrackerWeekly(page, MOCK_WEEKLY_WITH_SESSIONS)
		await homePage.navLink('home').click()
		await expect(homePage.timeChartSummary).toHaveText(
			'2h 30m total · 2 active days',
		)
	})

	test('retains previously confirmed values when a later read fails', async ({
		page,
		homePage,
	}) => {
		await mockTimeTrackerWeekly(page, MOCK_WEEKLY_WITH_SESSIONS)
		await homePage.goto()
		await expect(homePage.timeChartSummary).toHaveText(
			'2h 30m total · 2 active days',
		)
		await homePage.navLink('settings').click()
		await expect(homePage.timeChart).toHaveCount(0)
		await mockTimeTrackerWeeklyFailure(page)
		await homePage.navLink('home').click()
		await expect(homePage.timeChartLoading).toBeHidden()
		await expect(homePage.timeChartSummary).toHaveText(
			'2h 30m total · 2 active days',
		)
	})
})
