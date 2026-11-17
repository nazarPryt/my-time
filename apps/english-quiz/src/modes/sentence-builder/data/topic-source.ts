import type { RandomSource } from '../../../shared/lib/random'
import { pickRound, ROUND_SIZE } from '../model/pick-round'
import type { Round, Topic, TopicSummary } from '../model/types'
import type { TopicRecord } from './define-topic'
import { ADVANCED_TOPICS } from './topics/advanced'
import { BEGINNER_TOPICS } from './topics/beginner'
import { INTERMEDIATE_TOPICS } from './topics/intermediate'

/**
 * Where topics come from. Each method maps to one future API endpoint, so
 * swapping this for fetch calls changes nothing above the data layer:
 *
 *   listTopics()        GET /topics
 *   getTopic(id)        GET /topics/:id
 *   getRound(id, size)  GET /topics/:id/round?size=10
 *
 * The bank of sentences never leaves the source: the server picks the round.
 */
export interface TopicSource {
	listTopics(): Promise<readonly TopicSummary[]>
	/** Rejects with TopicNotFoundError for an unknown id. */
	getTopic(id: string): Promise<Topic>
	/** A fresh random selection on every call. Rejects like getTopic. */
	getRound(topicId: string, size?: number): Promise<Round>
}

export class TopicNotFoundError extends Error {
	constructor(id: string) {
		super(`Topic "${id}" was not found`)
		this.name = 'TopicNotFoundError'
	}
}

export function createLocalTopicSource(
	topics: readonly TopicRecord[],
	random: RandomSource = Math.random,
): TopicSource {
	function find(id: string): TopicRecord {
		const topic = topics.find((candidate) => candidate.id === id)
		if (!topic) throw new TopicNotFoundError(id)
		return topic
	}

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
			const { sentences: _bank, ...topic } = find(id)
			return topic
		},
		async getRound(topicId, size = ROUND_SIZE) {
			return {
				topicId,
				sentences: pickRound(find(topicId).sentences, size, random),
			}
		},
	}
}

export const ALL_TOPICS: readonly TopicRecord[] = [
	...BEGINNER_TOPICS,
	...INTERMEDIATE_TOPICS,
	...ADVANCED_TOPICS,
]

export const topicSource: TopicSource = createLocalTopicSource(ALL_TOPICS)
