import { TOPIC_LEVELS, type TopicLevel, type TopicSummary } from './types'

export const TOPIC_LEVEL_LABELS: Record<TopicLevel, string> = {
	beginner: 'Beginner',
	intermediate: 'Intermediate',
	advanced: 'Advanced',
}

export interface TopicGroup {
	level: TopicLevel
	label: string
	topics: readonly TopicSummary[]
}

/** Groups topics by level (beginner first), keeping their order; skips empty levels. */
export function groupTopicsByLevel(
	topics: readonly TopicSummary[],
): TopicGroup[] {
	return TOPIC_LEVELS.map((level) => ({
		level,
		label: TOPIC_LEVEL_LABELS[level],
		topics: topics.filter((topic) => topic.level === level),
	})).filter((group) => group.topics.length > 0)
}
