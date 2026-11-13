import { test as base, expect } from '../../support/dashboard.fixtures'
import { EnglishQuizPage, REMOTE_ASSETS } from './english-quiz-page'

const test = base.extend<{ quizPage: EnglishQuizPage }>({
	quizPage: async ({ page }, use) => {
		await use(new EnglishQuizPage(page))
	},
})

test.describe('English quiz micro frontend', () => {
	test('loads the Vue remote into the React host', async ({ quizPage }) => {
		await quizPage.goto()
		await expect(quizPage.quizHeading).toBeVisible()
		await expect(quizPage.error).toBeHidden()
	})

	test('is reachable from the sidebar', async ({ quizPage, page }) => {
		await page.goto('/dashboard/settings')
		await quizPage.navLink('english-quiz').click()
		await expect(quizPage.quizHeading).toBeVisible()
	})

	test('renders inside a shadow root so host styles cannot leak in', async ({
		quizPage,
	}) => {
		await quizPage.goto()
		await expect(quizPage.quizHeading).toBeVisible()
		const hasShadowRoot = await quizPage.remote.evaluate((el) =>
			Array.from(el.querySelectorAll('div')).some((d) => d.shadowRoot),
		)
		expect(hasShadowRoot).toBe(true)
	})

	test('reports the finished quiz to the host through the contract', async ({
		quizPage,
	}) => {
		await quizPage.goto()
		await expect(quizPage.lastResult).toContainText('—')

		await quizPage.playThrough('A2')

		await expect(quizPage.score).toHaveText(/\d+ \/ 8/)
		const score = (await quizPage.score.textContent())?.replace(/\s/g, '')
		await expect(quizPage.lastResult).toContainText(`A2 · ${score}`)
	})

	test('isolates a remote outage and recovers on retry', async ({
		quizPage,
		page,
	}) => {
		await page.route(REMOTE_ASSETS, (route) => route.fulfill({ status: 503 }))
		await quizPage.goto()

		await expect(quizPage.error).toBeVisible()
		// The host shell keeps working while the remote is down.
		await expect(quizPage.navLink('workout')).toBeVisible()

		await page.unroute(REMOTE_ASSETS)
		await quizPage.retryButton.click()
		await expect(quizPage.quizHeading).toBeVisible()
		await expect(quizPage.error).toBeHidden()
	})
})
