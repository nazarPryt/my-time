import type {
	RemoteApiFetch,
	RemoteBaseProps,
	RemoteDescriptor,
} from './remote-module'

/**
 * Contract between the host (apps/web) and the English quiz remote
 * (apps/english-quiz). Changing anything here that is not purely additive is
 * a breaking change: bump ENGLISH_QUIZ_CONTRACT_VERSION and ship the remote
 * and host together, or keep the remote backwards compatible.
 *
 * v2: the host owns navigation (`mode` prop + `mode-changed` event).
 * v3: content comes from the host's API through the required `apiFetch`.
 */
export const ENGLISH_QUIZ_CONTRACT_VERSION = 3

export const ENGLISH_QUIZ_REMOTE = {
	name: 'englishQuiz',
	expose: './mount',
	contractVersion: ENGLISH_QUIZ_CONTRACT_VERSION,
} as const satisfies RemoteDescriptor

export const QUIZ_LEVELS = ['A2', 'B1', 'B2'] as const
export type QuizLevel = (typeof QUIZ_LEVELS)[number]

export const DEFAULT_QUIZ_LEVEL: QuizLevel = 'B1'

/** Also the URL values (`?mode=<id>`): renaming one breaks bookmarks. */
export const ENGLISH_QUIZ_MODES = ['level-quiz', 'sentence-builder'] as const
export type QuizMode = (typeof ENGLISH_QUIZ_MODES)[number]

export function isQuizMode(value: unknown): value is QuizMode {
	return (ENGLISH_QUIZ_MODES as readonly unknown[]).includes(value)
}

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
	/** `null` = the hub. The host updates the URL and passes `mode` back. */
	| { type: 'mode-changed'; mode: QuizMode | null }

/** Props the host passes to the quiz (host → remote communication). */
export interface EnglishQuizProps extends RemoteBaseProps {
	/** `undefined` shows the hub. */
	mode?: QuizMode
	/** Loads the sentence builder's topics and rounds from the host's API. */
	apiFetch: RemoteApiFetch
	/** Level preselected on the level quiz start screen. */
	initialLevel?: QuizLevel
	onEvent?: (event: EnglishQuizEvent) => void
}
