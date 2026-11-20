import type { QuizLevel } from '@my-time/micro-frontends'

export type QuizTopic =
	| 'grammar'
	| 'vocabulary'
	| 'phrasal verbs'
	| 'prepositions'

export interface Question {
	id: string
	level: QuizLevel
	topic: QuizTopic
	prompt: string
	options: readonly string[]
	/** Index into `options` of the correct answer. */
	answerIndex: number
	explanation: string
}
