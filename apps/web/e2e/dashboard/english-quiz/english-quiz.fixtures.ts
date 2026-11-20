import { test as base } from '../../support/dashboard.fixtures'
import { mockEnglishQuizTopics } from './english-quiz.mocks'
import { EnglishQuizPage } from './english-quiz-page'

// The remote runs on its own dev server; only its API calls are mocked.
export const test = base.extend<{ quizPage: EnglishQuizPage }>({
	quizPage: async ({ page }, use) => {
		await mockEnglishQuizTopics(page)
		await use(new EnglishQuizPage(page))
	},
})

export { expect } from '@playwright/test'
