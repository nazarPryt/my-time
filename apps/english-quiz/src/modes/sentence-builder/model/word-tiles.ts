import { type RandomSource, shuffle } from '../../../shared/lib/random'
import type { Sentence } from './types'

export const TILES_PER_STEP = 6

export interface WordTilesInput {
	/** The answer's words, from parseAnswer(). */
	words: readonly string[]
	/** Index of the word the learner has to pick next. */
	step: number
	traps?: Sentence['traps']
	/** Generic distractors used when a word has too few traps. */
	pool: readonly string[]
	random: RandomSource
	count?: number
}

function capitalize(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1)
}

function trapsFor(traps: Sentence['traps'], word: string): readonly string[] {
	if (!traps) return []
	const key = Object.keys(traps).find(
		(candidate) => candidate.toLowerCase() === word.toLowerCase(),
	)
	return key ? (traps[key] ?? []) : []
}

/**
 * The tiles offered for one step: the expected word plus distractors,
 * shuffled. Hand-picked traps for the expected word come first, then other
 * words of the sentence, then the shared pool. No two tiles read the same
 * (case-insensitively), so the right answer is never ambiguous.
 */
export function buildWordTiles({
	words,
	step,
	traps,
	pool,
	random,
	count = TILES_PER_STEP,
}: WordTilesInput): string[] {
	const expected = words[step]
	if (expected === undefined) return []

	const seen = new Set([expected.toLowerCase()])
	const takeUnseen = (candidates: readonly string[]) =>
		candidates.filter((word) => {
			const key = word.toLowerCase()
			if (seen.has(key)) return false
			seen.add(key)
			return true
		})

	// The first word is skipped: it is capitalised, so it would read oddly
	// in the middle of a sentence.
	const sentenceWords = words.slice(1)
	const distractors = [
		...takeUnseen(shuffle(trapsFor(traps, expected), random)),
		...takeUnseen(shuffle([...sentenceWords, ...pool], random)),
	].slice(0, count - 1)

	const tiles = shuffle([expected, ...distractors], random)
	return step === 0 ? tiles.map(capitalize) : tiles
}
