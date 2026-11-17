import type { MaybeRefOrGetter } from 'vue'
import { useAsyncData } from '../../../shared/composables/use-async-data'
import { topicSource } from '../data/topic-source'

/** The sentences for one attempt at a topic; `reload` picks a new set. */
export function useRound(topicId: MaybeRefOrGetter<string>) {
	const { data, pending, error, reload } = useAsyncData(topicId, (id) =>
		topicSource.getRound(id),
	)
	return { round: data, pending, error, reload }
}
