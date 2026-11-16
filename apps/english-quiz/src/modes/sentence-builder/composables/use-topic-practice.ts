import {
	computed,
	type MaybeRefOrGetter,
	shallowRef,
	toValue,
	watch,
} from 'vue'
import {
	completeSentence,
	currentIndex,
	isFinished,
	type PracticeState,
	progressDots,
	score,
	startPractice,
} from '../model/topic-practice'
import type { Topic } from '../model/types'

/**
 * Walks through a topic's sentences: which one is current, the progress dots
 * and the final score. Starts over when a different topic is passed in.
 */
export function useTopicPractice(topic: MaybeRefOrGetter<Topic>) {
	const sentences = computed(() => toValue(topic).sentences)
	const state = shallowRef<PracticeState>(startPractice(sentences.value.length))

	function restart() {
		state.value = startPractice(sentences.value.length)
	}

	watch(() => toValue(topic).id, restart)

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
		restart,
	}
}
