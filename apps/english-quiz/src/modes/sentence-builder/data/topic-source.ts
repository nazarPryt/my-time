import type { Topic, TopicSummary } from '../model/types'
import { ADVANCED_TOPICS } from './topics/advanced'
import { BEGINNER_TOPICS } from './topics/beginner'
import { INTERMEDIATE_TOPICS } from './topics/intermediate'

/**
 * Where topics come from. Async on purpose: today it reads hard-coded data,
 * later an API client implements the same interface and nothing above the
 * data layer changes.
 */
export interface TopicSource {
	listTopics(): Promise<readonly TopicSummary[]>
	/** Rejects with TopicNotFoundError for an unknown id. */
	getTopic(id: string): Promise<Topic>
}

export class TopicNotFoundError extends Error {
	constructor(id: string) {
		super(`Topic "${id}" was not found`)
		this.name = 'TopicNotFoundError'
	}
}

export function createLocalTopicSource(topics: readonly Topic[]): TopicSource {
	return {
		async listTopics() {
			return topics.map(({ id, level, title, subtitle }) => ({
				id,
				level,
				title,
				subtitle,
			}))
		},
		async getTopic(id) {
			const topic = topics.find((candidate) => candidate.id === id)
			if (!topic) throw new TopicNotFoundError(id)
			return topic
		},
	}
}

export const ALL_TOPICS: readonly Topic[] = [
	...BEGINNER_TOPICS,
	...INTERMEDIATE_TOPICS,
	...ADVANCED_TOPICS,
]

export const topicSource: TopicSource = createLocalTopicSource(ALL_TOPICS)
