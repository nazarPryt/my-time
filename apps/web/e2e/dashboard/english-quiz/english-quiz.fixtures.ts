import { test as base } from '../../support/dashboard.fixtures'
import { EnglishQuizPage } from './english-quiz-page'

// No default mocks: the remote runs on its own dev server.
export const test = base.extend<{ quizPage: EnglishQuizPage }>({
	quizPage: async ({ page }, use) => {
		await use(new EnglishQuizPage(page))
	},
})

export { expect } from '@playwright/test'
