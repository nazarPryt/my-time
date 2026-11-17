import type { AnswerToken } from './parse-answer'

/**
 * State machine for assembling one sentence. Picks are not checked one by
 * one: the learner fills every slot, and the whole sentence is checked when
 * the last word is placed.
 *
 *   building ──pick── … ──last word──▶ correct
 *                                 └──▶ wrong ──retry──▶ building (from scratch)
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

export function pickWord(
	state: AttemptState,
	words: readonly string[],
	word: string,
): AttemptState {
	if (state.status !== 'building') return state
	const picked = [...state.picked, word]
	if (picked.length < words.length) return { ...state, picked }

	const correct = picked.every(
		(pickedWord, index) => pickedWord === words[index],
	)
	return correct
		? { ...state, picked, status: 'correct' }
		: { ...state, picked, status: 'wrong', mistakes: state.mistakes + 1 }
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
