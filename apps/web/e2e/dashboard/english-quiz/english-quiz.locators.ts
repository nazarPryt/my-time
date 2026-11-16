import {
	ENGLISH_QUIZ_REMOTE_TEST_IDS,
	type QuizLevel,
	type QuizMode,
} from '@my-time/mfe-contracts'
import type { Locator, Page } from '@playwright/test'
import { ENGLISH_QUIZ_TEST_IDS } from '@/features/english-quiz/test-ids'
import { BaseLocators } from '../base-locators'

const { hub, modeScreen, levelQuiz, sentenceBuilder } =
	ENGLISH_QUIZ_REMOTE_TEST_IDS

/** Remote ids come from the contract; getByTestId pierces the shadow root. */
export class EnglishQuizLocators extends BaseLocators {
	// Host page
	readonly root: Locator
	readonly remote: Locator
	readonly error: Locator
	readonly retryButton: Locator
	readonly lastResult: Locator

	// Remote: hub + mode screen
	readonly hub: Locator
	readonly modeScreen: Locator
	readonly backToHubButton: Locator

	// Remote: level quiz
	readonly levelPicker: Locator
	readonly startQuizButton: Locator
	readonly answerOptions: Locator
	readonly nextQuestionButton: Locator
	readonly seeResultsButton: Locator
	readonly quizSummary: Locator
	readonly scoreCorrect: Locator
	readonly scoreTotal: Locator

	// Remote: sentence builder
	readonly topicList: Locator
	readonly topicCards: Locator
	readonly wordTiles: Locator
	readonly showRuleButton: Locator
	readonly ruleSections: Locator
	readonly backToExerciseButton: Locator
	readonly backToTopicsButton: Locator

	constructor(page: Page) {
		super(page)

		this.root = page.getByTestId(ENGLISH_QUIZ_TEST_IDS.page)
		this.remote = this.root.getByTestId(ENGLISH_QUIZ_TEST_IDS.remote)
		this.error = this.root.getByTestId(ENGLISH_QUIZ_TEST_IDS.error)
		this.retryButton = this.error.getByTestId(ENGLISH_QUIZ_TEST_IDS.retry)
		this.lastResult = this.root.getByTestId(ENGLISH_QUIZ_TEST_IDS.lastResult)

		this.hub = this.remote.getByTestId(hub.root)
		this.modeScreen = this.remote.getByTestId(modeScreen.root)
		this.backToHubButton = this.modeScreen.getByTestId(modeScreen.backToHub)

		this.levelPicker = this.modeScreen.getByTestId(levelQuiz.levelPicker)
		this.startQuizButton = this.levelPicker.getByTestId(levelQuiz.start)
		this.answerOptions = this.modeScreen.getByTestId(levelQuiz.answerOption)
		this.nextQuestionButton = this.modeScreen.getByTestId(
			levelQuiz.nextQuestion,
		)
		this.seeResultsButton = this.modeScreen.getByTestId(levelQuiz.seeResults)
		this.quizSummary = this.modeScreen.getByTestId(levelQuiz.summary)
		this.scoreCorrect = this.quizSummary.getByTestId(levelQuiz.scoreCorrect)
		this.scoreTotal = this.quizSummary.getByTestId(levelQuiz.scoreTotal)

		this.topicList = this.modeScreen.getByTestId(sentenceBuilder.topicList)
		this.topicCards = this.topicList.getByTestId(sentenceBuilder.topicCard)
		this.wordTiles = this.modeScreen
			.getByTestId(sentenceBuilder.wordTiles)
			.getByTestId(sentenceBuilder.wordTile)
		this.showRuleButton = this.modeScreen.getByTestId(sentenceBuilder.showRule)
		this.ruleSections = this.modeScreen.getByTestId(
			sentenceBuilder.ruleSections,
		)
		this.backToExerciseButton = this.modeScreen.getByTestId(
			sentenceBuilder.backToExercise,
		)
		this.backToTopicsButton = this.modeScreen.getByTestId(
			sentenceBuilder.backToTopics,
		)
	}

	modeCard(mode: QuizMode) {
		return this.hub.getByTestId(hub.modeCard(mode))
	}

	modeScore(mode: QuizMode) {
		return this.modeCard(mode).getByTestId(hub.modeScore)
	}

	levelOption(level: QuizLevel) {
		return this.levelPicker.getByTestId(levelQuiz.levelOption(level))
	}
}
