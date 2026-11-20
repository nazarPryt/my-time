import type { RandomSource } from 'contracts/english-quiz'
import {
	acceptedAnswers,
	answerWords,
	formatAnswer,
} from 'contracts/english-quiz'
import {
	computed,
	type MaybeRefOrGetter,
	shallowRef,
	toValue,
	watch,
} from 'vue'
import { WORD_POOL } from '../data/word-pool'
import {
	type AttemptState,
	checkWords,
	closestAnswer,
	INITIAL_ATTEMPT,
	nextWords,
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
 * the next word, and the right/wrong outcome once the last word is placed.
 * Any accepted answer counts. Resets for a new sentence.
 */
export function useSentenceAttempt(
	sentence: MaybeRefOrGetter<Sentence>,
	{ random = Math.random }: UseSentenceAttemptOptions = {},
) {
	const answers = computed(() => acceptedAnswers(toValue(sentence)))
	const wordLists = computed(() => answers.value.map(answerWords))
	const state = shallowRef<AttemptState>(INITIAL_ATTEMPT)

	watch(
		() => toValue(sentence).id,
		() => {
			state.value = INITIAL_ATTEMPT
		},
	)

	const picked = computed(() => state.value.picked)
	// The accepted answer the learner is following, given the picks so far.
	const target = computed(
		() => answers.value[closestAnswer(wordLists.value, picked.value)] ?? [],
	)

	// Depends only on the sentence and the picks, so the tiles are reshuffled
	// when the learner moves to the next word, not on every re-render.
	const tiles = computed(() =>
		buildWordTiles({
			words: answerWords(target.value),
			step: picked.value.length,
			alternatives: nextWords(wordLists.value, picked.value),
			traps: toValue(sentence).traps,
			pool: WORD_POOL,
			random,
		}),
	)

	return {
		status: computed(() => state.value.status),
		picked,
		/** Each picked word against the closest answer; shown once it is wrong. */
		checkedWords: computed(() => checkWords(picked.value, target.value)),
		/** The accepted answer the learner built (or is closest to), punctuated. */
		answerText: computed(() => formatAnswer(target.value)),
		isFirstTry: computed(() => state.value.mistakes === 0),
		tiles,
		pick(word: string) {
			state.value = pickWord(state.value, wordLists.value, word)
		},
		undo() {
			state.value = undoWord(state.value)
		},
		retry() {
			state.value = retryAttempt(state.value)
		},
	}
}
