import { computed } from 'vue'
import { useAsyncData } from '../../../shared/composables/use-async-data'
import { topicSource } from '../data/topic-source'
import { groupTopicsByLevel } from '../model/group-topics'

/** All topics, grouped by level, for the topic list. */
export function useTopicCatalog() {
	const { data, pending, error, reload } = useAsyncData(null, () =>
		topicSource.listTopics(),
	)
	const groups = computed(() => groupTopicsByLevel(data.value ?? []))

	return { groups, pending, error, reload }
}
