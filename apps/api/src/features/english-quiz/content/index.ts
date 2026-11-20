import type { TopicRecord } from './define-topic'
import { ADVANCED_TOPICS } from './topics/advanced'
import { BEGINNER_TOPICS } from './topics/beginner'
import { INTERMEDIATE_TOPICS } from './topics/intermediate'

/** Every topic in display order: the source the database is synced from. */
export const ALL_TOPICS: readonly TopicRecord[] = [
	...BEGINNER_TOPICS,
	...INTERMEDIATE_TOPICS,
	...ADVANCED_TOPICS,
]
