import {
	API_WORKOUT_PROGRESS,
	MOCK_PROGRESS,
	mockWorkoutProgress,
} from '../workout/workout.mocks'
import { expect, test } from './home.fixtures'

test.describe('Workout progress chart on dashboard home', () => {
	test.beforeEach(async ({ homePage }) => {
		await homePage.goto()
	})

	test('renders the progress chart', async ({ homePage }) => {
		await expect(homePage.progressChart).toBeVisible()
	})

	test('shows the current month label', async ({ homePage }) => {
		await expect(homePage.chartMonthLabel).toBeVisible()
		// e.g. "April 2026"
		await expect(homePage.chartMonthLabel).toHaveText(/[A-Z][a-z]+ \d{4}/)
	})

	test('next-month button is disabled on the current month', async ({
		homePage,
	}) => {
		await expect(homePage.nextMonthBtn).toBeDisabled()
	})

	test('prev-month button navigates to the previous month', async ({
		page,
		homePage,
	}) => {
		const currentLabel = await homePage.chartMonthLabel.textContent()

		// Mock progress for the previous month too
		await mockWorkoutProgress(page, MOCK_PROGRESS)

		await homePage.prevMonthBtn.click()

		const newLabel = await homePage.chartMonthLabel.textContent()
		expect(newLabel).not.toBe(currentLabel)
	})

	test('next-month button becomes enabled after navigating back', async ({
		page,
		homePage,
	}) => {
		await mockWorkoutProgress(page, MOCK_PROGRESS)

		await homePage.prevMonthBtn.click()
		await expect(homePage.nextMonthBtn).toBeEnabled()
	})

	test('shows loading state while fetching chart data', async ({
		page,
		homePage,
	}) => {
		// Remove existing mock and add a delayed one
		await page.unroute(API_WORKOUT_PROGRESS)
		let resolveProgress!: () => void
		await page.route(API_WORKOUT_PROGRESS, async (route) => {
			await new Promise<void>((r) => {
				resolveProgress = r
			})
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(MOCK_PROGRESS),
			})
		})

		await homePage.prevMonthBtn.click()

		await expect(homePage.chartLoading).toBeVisible()
		resolveProgress()
		await expect(homePage.chartLoading).not.toBeVisible()
	})
})
