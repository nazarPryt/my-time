import type { MaybeRefOrGetter } from 'vue'
import { useAsyncData } from '../../../shared/composables/use-async-data'
import { useTopicSource } from '../data/topic-source'

/** A topic with its rule, reloaded when the id changes. */
export function useTopic(topicId: MaybeRefOrGetter<string>) {
	const topicSource = useTopicSource()
	const { data, pending, error, reload } = useAsyncData(topicId, (id) =>
		topicSource.getTopic(id),
	)
	return { topic: data, pending, error, reload }
}
