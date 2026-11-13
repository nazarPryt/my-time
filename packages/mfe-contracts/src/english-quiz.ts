import type { RemoteBaseProps, RemoteDescriptor } from './remote-module'

/**
 * Contract between the host (apps/web) and the English quiz remote
 * (apps/english-quiz). Changing anything here that is not purely additive is
 * a breaking change: bump ENGLISH_QUIZ_CONTRACT_VERSION and ship the remote
 * and host together, or keep the remote backwards compatible.
 */
export const ENGLISH_QUIZ_CONTRACT_VERSION = 1

export const ENGLISH_QUIZ_REMOTE = {
	name: 'englishQuiz',
	expose: './mount',
	contractVersion: ENGLISH_QUIZ_CONTRACT_VERSION,
} as const satisfies RemoteDescriptor

export const QUIZ_LEVELS = ['A2', 'B1', 'B2'] as const
export type QuizLevel = (typeof QUIZ_LEVELS)[number]

export interface QuizResult {
	level: QuizLevel
	correct: number
	total: number
	/** ISO-8601 timestamp of when the quiz was finished. */
	completedAt: string
}

/** Events the quiz reports to the host (remote → host communication). */
export type EnglishQuizEvent =
	| { type: 'quiz-started'; level: QuizLevel }
	| { type: 'quiz-completed'; result: QuizResult }

/** Props the host passes to the quiz (host → remote communication). */
export interface EnglishQuizProps extends RemoteBaseProps {
	/** Level preselected on the start screen. */
	initialLevel?: QuizLevel
	onEvent?: (event: EnglishQuizEvent) => void
}
