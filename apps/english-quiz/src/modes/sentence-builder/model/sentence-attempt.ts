import type { AnswerToken } from '@my-time/contracts/english-quiz'

/**
 * State machine for assembling one sentence. Picks are not checked one by
 * one: the learner fills every slot, and the whole sentence is checked when
 * the last word is placed.
 *
 *   building ──pick── … ──last word──▶ correct
 *                                 └──▶ wrong ──retry──▶ building (from scratch)
 *
 * A sentence can have several accepted answers (word lists, canonical first).
 * The learner is measured against the one closest to what they picked, so
 * "I am not" and "I'm not" both lead to a correct sentence.
 */
export type AttemptStatus = 'building' | 'wrong' | 'correct'

export interface AttemptState {
	readonly picked: readonly string[]
	readonly status: AttemptStatus
	/** Wrong sentences so far, across retries of this sentence. */
	readonly mistakes: number
}

export const INITIAL_ATTEMPT: AttemptState = {
	picked: [],
	status: 'building',
	mistakes: 0,
}

/**
 * One slot of a checked sentence: what was picked vs. what was expected,
 * with the answer's punctuation around it (never part of the check).
 */
export interface CheckedWord {
	readonly picked: string
	readonly expected: string
	readonly correct: boolean
	readonly before: string
	readonly after: string
}

/** Compares the picked words with the answer, position by position. */
export function checkWords(
	picked: readonly string[],
	tokens: readonly AnswerToken[],
): CheckedWord[] {
	return picked.map((word, index) => {
		const { word: expected = '', before = '', after = '' } = tokens[index] ?? {}
		return { picked: word, expected, correct: word === expected, before, after }
	})
}

type WordList = readonly string[]

function sharedPrefix(answer: WordList, picked: WordList): number {
	let length = 0
	while (length < picked.length && answer[length] === picked[length]) length++
	return length
}

/** Index of the answer sharing the longest start with `picked`; first on ties. */
export function closestAnswer(
	answers: readonly WordList[],
	picked: WordList,
): number {
	let best = 0
	let bestLength = -1
	answers.forEach((answer, index) => {
		const length = sharedPrefix(answer, picked)
		if (length > bestLength) {
			best = index
			bestLength = length
		}
	})
	return best
}

/** Every word that continues `picked` correctly in at least one answer. */
export function nextWords(
	answers: readonly WordList[],
	picked: WordList,
): string[] {
	const words = answers
		.filter(
			(answer) =>
				answer.length > picked.length &&
				sharedPrefix(answer, picked) === picked.length,
		)
		.map((answer) => answer[picked.length] as string)
	return [...new Set(words)]
}

export function pickWord(
	state: AttemptState,
	answers: readonly WordList[],
	word: string,
): AttemptState {
	if (state.status !== 'building') return state
	const picked = [...state.picked, word]

	const complete = answers.some(
		(answer) =>
			answer.length === picked.length &&
			sharedPrefix(answer, picked) === picked.length,
	)
	if (complete) return { ...state, picked, status: 'correct' }

	const target = answers[closestAnswer(answers, picked)] ?? []
	if (picked.length < target.length) return { ...state, picked }
	return { ...state, picked, status: 'wrong', mistakes: state.mistakes + 1 }
}

/** Removes the last picked word (the backspace button). */
export function undoWord(state: AttemptState): AttemptState {
	if (state.status !== 'building' || state.picked.length === 0) return state
	return { ...state, picked: state.picked.slice(0, -1) }
}

/** Starts the same sentence over after a mistake; the mistake count is kept. */
export function retryAttempt(state: AttemptState): AttemptState {
	if (state.status !== 'wrong') return state
	return { ...INITIAL_ATTEMPT, mistakes: state.mistakes }
}
