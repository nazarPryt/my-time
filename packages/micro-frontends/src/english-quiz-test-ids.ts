import type { QuizLevel, QuizMode } from './english-quiz'

/** Shared so the remote and the host's e2e tests use the same ids. */
export const ENGLISH_QUIZ_REMOTE_TEST_IDS = {
	hub: {
		root: 'english-quiz-hub',
		modeCard: (mode: QuizMode) => `english-quiz-mode-card-${mode}`,
		modeScore: 'english-quiz-mode-score',
	},
	modeScreen: {
		root: 'english-quiz-mode-screen',
		backToHub: 'english-quiz-back-to-hub',
	},
	levelQuiz: {
		levelPicker: 'level-quiz-level-picker',
		levelOption: (level: QuizLevel) => `level-quiz-level-${level}`,
		start: 'level-quiz-start',
		answerOption: 'level-quiz-answer-option',
		nextQuestion: 'level-quiz-next-question',
		seeResults: 'level-quiz-see-results',
		summary: 'level-quiz-summary',
		scoreCorrect: 'level-quiz-score-correct',
		scoreTotal: 'level-quiz-score-total',
	},
	sentenceBuilder: {
		topicList: 'sentence-builder-topic-list',
		topicCard: 'sentence-builder-topic-card',
		wordTiles: 'sentence-builder-word-tiles',
		wordTile: 'sentence-builder-word-tile',
		showRule: 'sentence-builder-show-rule',
		ruleSections: 'sentence-builder-rule-sections',
		backToExercise: 'sentence-builder-back-to-exercise',
		backToTopics: 'sentence-builder-back-to-topics',
	},
} as const
