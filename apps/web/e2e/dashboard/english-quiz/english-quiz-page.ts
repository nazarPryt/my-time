import type { QuizLevel, QuizMode } from '@my-time/micro-frontends'
import type { LinkProps } from '@tanstack/react-router'
import { ENGLISH_QUIZ_MODE_PARAM } from '@/features/english-quiz/lib/english-quiz-search'
import { EnglishQuizLocators } from './english-quiz.locators'

export const ENGLISH_QUIZ_PATH: LinkProps['to'] = '/dashboard/english-quiz'

/** For `toHaveURL`: true when the URL opens `mode` (null = the hub). */
export function urlOpensMode(mode: QuizMode | null) {
	return (url: URL) => url.searchParams.get(ENGLISH_QUIZ_MODE_PARAM) === mode
}

export class EnglishQuizPage extends EnglishQuizLocators {
	/** Takes any string, to test unknown modes. */
	async goto(mode?: QuizMode | string) {
		const search = mode
			? `?${new URLSearchParams({ [ENGLISH_QUIZ_MODE_PARAM]: mode })}`
			: ''
		await this.page.goto(`${ENGLISH_QUIZ_PATH}${search}`)
		await this.root.waitFor({ state: 'visible' })
	}

	async openMode(mode: QuizMode) {
		await this.modeCard(mode).click()
	}

	async backToHub() {
		await this.backToHubButton.click()
	}

	/** Plays a full level quiz, always picking the first answer. */
	async playThrough(level: QuizLevel) {
		await this.levelOption(level).click()
		await this.startQuizButton.click()
		for (;;) {
			await this.answerOptions.first().click()
			await this.nextQuestionButton.or(this.seeResultsButton).waitFor()
			if (await this.seeResultsButton.isVisible()) {
				await this.seeResultsButton.click()
				return
			}
			await this.nextQuestionButton.click()
		}
	}

	/** The finished quiz's score as the host formats it, e.g. "6/8". */
	async readScore() {
		await this.quizSummary.waitFor({ state: 'visible' })
		const correct = (await this.scoreCorrect.textContent())?.trim()
		const total = (await this.scoreTotal.textContent())?.trim()
		return `${correct}/${total}`
	}
}
