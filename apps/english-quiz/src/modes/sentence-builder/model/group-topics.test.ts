import { describe, expect, test } from 'bun:test'
import { groupTopicsByLevel } from './group-topics'
import type { TopicSummary } from './types'

const topic = (id: string, level: TopicSummary['level']): TopicSummary => ({
	id,
	level,
	title: id,
	subtitle: id,
})

describe('groupTopicsByLevel', () => {
	test('orders levels beginner → advanced, keeps topic order, skips empty levels', () => {
		const groups = groupTopicsByLevel([
			topic('c', 'advanced'),
			topic('a1', 'beginner'),
			topic('a2', 'beginner'),
		])
		expect(groups.map((group) => group.level)).toEqual(['beginner', 'advanced'])
		expect(groups[0]?.topics.map((t) => t.id)).toEqual(['a1', 'a2'])
		expect(groups[0]?.label).toBe('Beginner')
	})
})
