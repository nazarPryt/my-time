import type { LinkProps } from '@tanstack/react-router'
import { ENGLISH_QUIZ_TEST_IDS } from '@/features/english-quiz/test-ids'
import { BaseLocators } from '../base-locators'

export const ENGLISH_QUIZ_PATH: LinkProps['to'] = '/dashboard/english-quiz'
/** Every request the browser makes for the remote's files. */
export const REMOTE_ASSETS = '**/remotes/english-quiz/**'

/**
 * The quiz is a black box owned by another app: locate its content by role
 * and text (Playwright pierces open shadow roots), not by its internals.
 */
export class EnglishQuizPage extends BaseLocators {
	get root() {
		return this.page.getByTestId(ENGLISH_QUIZ_TEST_IDS.page)
	}
	get remote() {
		return this.page.getByTestId(ENGLISH_QUIZ_TEST_IDS.remote)
	}
	get error() {
		return this.page.getByTestId(ENGLISH_QUIZ_TEST_IDS.error)
	}
	get retryButton() {
		return this.page.getByTestId(ENGLISH_QUIZ_TEST_IDS.retry)
	}
	get lastResult() {
		return this.page.getByTestId(ENGLISH_QUIZ_TEST_IDS.lastResult)
	}
	get quizHeading() {
		return this.remote.getByRole('heading', { name: 'Test your English' })
	}
	get score() {
		return this.remote.getByLabel('Score')
	}

	async goto() {
		await this.page.goto(ENGLISH_QUIZ_PATH)
		await this.root.waitFor({ state: 'visible' })
	}

	/** Plays a full quiz, always picking the first option. */
	async playThrough(level: 'A2' | 'B1' | 'B2') {
		await this.remote.getByRole('radio', { name: new RegExp(level) }).click()
		await this.remote.getByRole('button', { name: 'Start quiz' }).click()
		for (;;) {
			await this.remote.locator('button.option').first().click()
			const next = this.remote.getByRole('button', {
				name: /Next question|See results/,
			})
			const isLast = (await next.textContent())?.includes('See results')
			await next.click()
			if (isLast) break
		}
	}
}
