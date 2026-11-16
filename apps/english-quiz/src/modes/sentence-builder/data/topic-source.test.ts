import { describe, expect, test } from 'bun:test'
import { parseAnswer } from '../model/parse-answer'
import {
	ALL_TOPICS,
	createLocalTopicSource,
	TopicNotFoundError,
} from './topic-source'

describe('hard-coded topics', () => {
	test('have unique topic and sentence ids', () => {
		const topicIds = ALL_TOPICS.map((topic) => topic.id)
		const sentenceIds = ALL_TOPICS.flatMap((topic) =>
			topic.sentences.map((sentence) => sentence.id),
		)
		expect(new Set(topicIds).size).toBe(topicIds.length)
		expect(new Set(sentenceIds).size).toBe(sentenceIds.length)
	})

	test('every topic has sentences and a rule with examples', () => {
		for (const topic of ALL_TOPICS) {
			expect(topic.sentences.length, topic.id).toBeGreaterThan(0)
			expect(topic.rule.length, topic.id).toBeGreaterThan(0)
			for (const section of topic.rule) {
				expect(section.examples.length, topic.id).toBeGreaterThan(0)
			}
		}
	})

	test('every trap belongs to a word of its answer', () => {
		for (const topic of ALL_TOPICS) {
			for (const sentence of topic.sentences) {
				const words = parseAnswer(sentence.answer).words.map((word) =>
					word.toLowerCase(),
				)
				expect(words.length, sentence.id).toBeGreaterThan(1)
				for (const key of Object.keys(sentence.traps ?? {})) {
					expect(words, `${sentence.id}: ${key}`).toContain(key.toLowerCase())
				}
			}
		}
	})
})

describe('local topic source', () => {
	const source = createLocalTopicSource(ALL_TOPICS)

	test('lists summaries without sentences or rules', async () => {
		const topics = await source.listTopics()
		expect(topics).toHaveLength(ALL_TOPICS.length)
		expect(Object.keys(topics[0] ?? {}).sort()).toEqual([
			'id',
			'level',
			'subtitle',
			'title',
		])
	})

	test('returns a full topic by id and rejects unknown ids', async () => {
		expect((await source.getTopic('present-simple')).title).toBe(
			'Present Simple',
		)
		await expect(source.getTopic('nope')).rejects.toBeInstanceOf(
			TopicNotFoundError,
		)
	})
})
