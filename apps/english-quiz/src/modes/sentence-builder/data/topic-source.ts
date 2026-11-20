import type { RemoteApiFetch } from '@my-time/mfe-contracts'
import {
	ENGLISH_QUIZ_ROUTES,
	ROUND_SIZE,
	RoundSchema,
	TopicSchema,
	TopicSummarySchema,
} from 'contracts/english-quiz'
import { useApiFetch } from '../../../shared/api/api-fetch'
import type { Round, Topic, TopicSummary } from '../model/types'

/**
 * Where topics come from. One method per API endpoint; the server picks the
 * round, so a topic's sentence bank never reaches the browser.
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

const topicPath = (id: string) =>
	`${ENGLISH_QUIZ_ROUTES.prefix}${ENGLISH_QUIZ_ROUTES.topicById.replace(':id', encodeURIComponent(id))}`

const roundPath = (id: string, size: number) =>
	`${ENGLISH_QUIZ_ROUTES.prefix}${ENGLISH_QUIZ_ROUTES.round.replace(':id', encodeURIComponent(id))}?size=${size}`

export function createHttpTopicSource(apiFetch: RemoteApiFetch): TopicSource {
	async function get<T>(
		path: string,
		schema: { parse(value: unknown): T },
		topicId?: string,
	): Promise<T> {
		const response = await apiFetch(path)
		if (response.status === 404 && topicId) {
			throw new TopicNotFoundError(topicId)
		}
		if (!response.ok) {
			throw new Error(`Request failed (${response.status}): ${path}`)
		}
		return schema.parse(await response.json())
	}

	return {
		listTopics: () =>
			get(
				`${ENGLISH_QUIZ_ROUTES.prefix}${ENGLISH_QUIZ_ROUTES.topics}`,
				TopicSummarySchema.array(),
			),
		getTopic: (id) => get(topicPath(id), TopicSchema, id),
		getRound: (topicId, size = ROUND_SIZE) =>
			get(roundPath(topicId, size), RoundSchema, topicId),
	}
}

/** The topic source backed by the host's API; call from setup(). */
export function useTopicSource(): TopicSource {
	return createHttpTopicSource(useApiFetch())
}
