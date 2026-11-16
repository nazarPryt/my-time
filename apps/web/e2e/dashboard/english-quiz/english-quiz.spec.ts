import { ENGLISH_QUIZ_MODES, QUIZ_LEVELS } from '@my-time/mfe-contracts'
import { expect, test } from './english-quiz.fixtures'
import { mockRemoteOutage, restoreRemote } from './english-quiz.mocks'
import { urlOpensMode } from './english-quiz-page'

const [LEVEL_QUIZ, SENTENCE_BUILDER] = ENGLISH_QUIZ_MODES
const [FIRST_LEVEL] = QUIZ_LEVELS

test.describe('English quiz micro frontend', () => {
	test.describe('Loading', () => {
		test('loads the Vue remote into the React host', async ({ quizPage }) => {
			await quizPage.goto()
			await expect(quizPage.hub).toBeVisible()
			await expect(quizPage.error).toBeHidden()
		})

		test('is reachable from the sidebar', async ({ quizPage, page }) => {
			await page.goto('/dashboard/settings')
			await quizPage.navLink('english-quiz').click()
			await expect(quizPage.hub).toBeVisible()
		})

		test('renders inside a shadow root so host styles cannot leak in', async ({
			quizPage,
		}) => {
			await quizPage.goto()
			await expect(quizPage.hub).toBeVisible()
			const isInShadowRoot = await quizPage.hub.evaluate(
				(el) => el.getRootNode() instanceof ShadowRoot,
			)
			expect(isInShadowRoot).toBe(true)
		})

		test('isolates a remote outage and recovers on retry', async ({
			quizPage,
			page,
		}) => {
			await mockRemoteOutage(page)
			await quizPage.goto()

			await expect(quizPage.error).toBeVisible()
			// The host shell keeps working while the remote is down.
			await expect(quizPage.navLink('workout')).toBeVisible()

			await restoreRemote(page)
			await quizPage.retryButton.click()
			await expect(quizPage.hub).toBeVisible()
			await expect(quizPage.error).toBeHidden()
		})
	})

	test.describe('Hub and URL', () => {
		test('lists every mode on the hub', async ({ quizPage }) => {
			await quizPage.goto()
			for (const mode of ENGLISH_QUIZ_MODES) {
				await expect(quizPage.modeCard(mode)).toBeVisible()
			}
		})

		test('opens a mode from the hub and keeps it in the URL', async ({
			quizPage,
			page,
		}) => {
			await quizPage.goto()
			await quizPage.openMode(SENTENCE_BUILDER)

			await expect(page).toHaveURL(urlOpensMode(SENTENCE_BUILDER))
			await expect(quizPage.topicList).toBeVisible()

			await quizPage.backToHub()
			await expect(page).toHaveURL(urlOpensMode(null))
			await expect(quizPage.hub).toBeVisible()
		})

		test('deep-links into a mode', async ({ quizPage }) => {
			await quizPage.goto(LEVEL_QUIZ)
			await expect(quizPage.levelPicker).toBeVisible()
			await expect(quizPage.hub).toBeHidden()
		})

		test('falls back to the hub for an unknown mode', async ({ quizPage }) => {
			await quizPage.goto('removed-mode')
			await expect(quizPage.hub).toBeVisible()
			await expect(quizPage.modeScreen).toBeHidden()
		})

		test('moves between hub and mode with the browser history', async ({
			quizPage,
			page,
		}) => {
			await quizPage.goto()
			await quizPage.openMode(LEVEL_QUIZ)
			await expect(quizPage.levelPicker).toBeVisible()

			await page.goBack()
			await expect(quizPage.hub).toBeVisible()
			await expect(page).toHaveURL(urlOpensMode(null))

			await page.goForward()
			await expect(quizPage.levelPicker).toBeVisible()
			await expect(page).toHaveURL(urlOpensMode(LEVEL_QUIZ))
		})
	})

	test.describe('Level quiz', () => {
		test('reports the finished quiz to the host and shows the score on the hub', async ({
			quizPage,
		}) => {
			await quizPage.goto(LEVEL_QUIZ)
			await expect(quizPage.lastResult).toContainText('—')

			await quizPage.playThrough(FIRST_LEVEL)
			const score = await quizPage.readScore()

			await expect(quizPage.lastResult).toContainText(
				`${FIRST_LEVEL} · ${score}`,
			)

			await quizPage.backToHub()
			await expect(quizPage.modeScore(LEVEL_QUIZ)).toContainText(score)
		})

		test('keeps the last score after a reload', async ({ quizPage }) => {
			await quizPage.goto(LEVEL_QUIZ)
			await quizPage.playThrough(FIRST_LEVEL)
			const score = await quizPage.readScore()

			await quizPage.goto()
			await expect(quizPage.modeScore(LEVEL_QUIZ)).toContainText(score)
			await expect(quizPage.modeScore(SENTENCE_BUILDER)).toBeHidden()
		})
	})

	test.describe('Sentence builder', () => {
		test('opens a topic, its rule, and goes back to the topics', async ({
			quizPage,
		}) => {
			await quizPage.goto(SENTENCE_BUILDER)
			await quizPage.topicCards.first().click()
			await expect(quizPage.wordTiles.first()).toBeVisible()
			const tileCount = await quizPage.wordTiles.count()

			await quizPage.showRuleButton.click()
			await expect(quizPage.ruleSections).toBeVisible()
			await quizPage.backToExerciseButton.click()
			// v-show keeps the exercise's state while the rule is open.
			await expect(quizPage.wordTiles).toHaveCount(tileCount)

			await quizPage.backToTopicsButton.click()
			await expect(quizPage.topicList).toBeVisible()
		})
	})
})
