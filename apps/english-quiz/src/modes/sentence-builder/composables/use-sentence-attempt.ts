import {
	computed,
	type MaybeRefOrGetter,
	shallowRef,
	toValue,
	watch,
} from 'vue'
import type { RandomSource } from '../../../shared/lib/random'
import { WORD_POOL } from '../data/word-pool'
import { answerWords, parseAnswer } from '../model/parse-answer'
import {
	type AttemptState,
	checkWords,
	INITIAL_ATTEMPT,
	pickWord,
	retryAttempt,
	undoWord,
} from '../model/sentence-attempt'
import type { Sentence } from '../model/types'
import { buildWordTiles } from '../model/word-tiles'

export interface UseSentenceAttemptOptions {
	random?: RandomSource
}

/**
 * Assembling one sentence from word tiles: the picked words, the tiles for
 * the next word, and the right/wrong outcome once the last word is placed. Resets for a new sentence.
 */
export function useSentenceAttempt(
	sentence: MaybeRefOrGetter<Sentence>,
	{ random = Math.random }: UseSentenceAttemptOptions = {},
) {
	const tokens = computed(() => parseAnswer(toValue(sentence).answer))
	const words = computed(() => answerWords(tokens.value))
	const state = shallowRef<AttemptState>(INITIAL_ATTEMPT)

	watch(
		() => toValue(sentence).id,
		() => {
			state.value = INITIAL_ATTEMPT
		},
	)

	const step = computed(() => state.value.picked.length)
	// Depends only on the sentence and the step, so the tiles are reshuffled
	// when the learner moves to the next word, not on every re-render.
	const tiles = computed(() =>
		buildWordTiles({
			words: words.value,
			step: step.value,
			traps: toValue(sentence).traps,
			pool: WORD_POOL,
			random,
		}),
	)

	return {
		status: computed(() => state.value.status),
		picked: computed(() => state.value.picked),
		/** Each picked word against the answer; shown once the sentence is wrong. */
		checkedWords: computed(() => checkWords(state.value.picked, tokens.value)),
		isFirstTry: computed(() => state.value.mistakes === 0),
		tiles,
		pick(word: string) {
			state.value = pickWord(state.value, words.value, word)
		},
		undo() {
			state.value = undoWord(state.value)
		},
		retry() {
			state.value = retryAttempt(state.value)
		},
	}
}
