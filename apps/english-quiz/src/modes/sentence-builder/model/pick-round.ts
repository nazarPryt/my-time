import { type RandomSource, shuffle } from '../../../shared/lib/random'
import { SENTENCE_FORMS, type Sentence } from './types'

/** Sentences per attempt; a topic's bank is usually much larger. */
export const ROUND_SIZE = 10

/**
 * Picks `size` random sentences from a topic's bank, taking the forms
 * (affirmative / question / negative) in turn so a round is never all one
 * kind. Returns the whole bank, shuffled, when it is smaller than `size`.
 */
export function pickRound(
	bank: readonly Sentence[],
	size: number,
	random: RandomSource,
): Sentence[] {
	const queues = SENTENCE_FORMS.map((form) =>
		shuffle(
			bank.filter((sentence) => sentence.form === form),
			random,
		),
	)
	const picked: Sentence[] = []
	while (picked.length < size && queues.some((queue) => queue.length > 0)) {
		for (const queue of shuffle(queues, random)) {
			const next = queue.shift()
			if (next && picked.length < size) picked.push(next)
		}
	}
	return shuffle(picked, random)
}
