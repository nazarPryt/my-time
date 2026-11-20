import { computed, type MaybeRefOrGetter, shallowRef, toValue } from 'vue'
import {
	completeSentence,
	currentIndex,
	isFinished,
	type PracticeState,
	progressDots,
	score,
	startPractice,
} from '../model/topic-practice'
import type { Round } from '../model/types'

/**
 * Walks through a round's sentences: which one is current, the progress dots
 * and the final score. A new round remounts the practice (the parent shows
 * a skeleton while it loads), so the state never needs resetting here.
 */
export function useTopicPractice(round: MaybeRefOrGetter<Round>) {
	const sentences = computed(() => toValue(round).sentences)
	const state = shallowRef<PracticeState>(startPractice(sentences.value.length))

	const currentSentence = computed(
		() => sentences.value[currentIndex(state.value)] ?? null,
	)

	return {
		currentSentence,
		dots: computed(() => progressDots(state.value)),
		finished: computed(() => isFinished(state.value)),
		score: computed(() => score(state.value)),
		total: computed(() => state.value.total),
		completeSentence(firstTry: boolean) {
			state.value = completeSentence(state.value, firstTry)
		},
	}
}
