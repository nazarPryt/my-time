import { describe, expect, test } from 'bun:test'
import { seededRandom } from '../../../shared/lib/random'
import { answerWords, parseAnswer } from '../model/parse-answer'
import { SENTENCE_FORMS } from '../model/types'
import { defineTopic } from './define-topic'
import {
	ALL_TOPICS,
	createLocalTopicSource,
	TopicNotFoundError,
} from './topic-source'

const ALL_SENTENCES = ALL_TOPICS.flatMap((topic) => topic.sentences)

describe('hard-coded topics', () => {
	test('have unique topic and sentence ids', () => {
		const topicIds = ALL_TOPICS.map((topic) => topic.id)
		const sentenceIds = ALL_SENTENCES.map((sentence) => sentence.id)
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

	test('every sentence has a known form and at least two words', () => {
		for (const sentence of ALL_SENTENCES) {
			expect(SENTENCE_FORMS, sentence.id).toContain(sentence.form)
			expect(parseAnswer(sentence.answer).length, sentence.id).toBeGreaterThan(
				1,
			)
		}
	})

	test('every trap belongs to a word of its answer and is not that word', () => {
		for (const sentence of ALL_SENTENCES) {
			const words = answerWords(parseAnswer(sentence.answer)).map((word) =>
				word.toLowerCase(),
			)
			for (const [key, traps] of Object.entries(sentence.traps ?? {})) {
				expect(words, `${sentence.id}: ${key}`).toContain(key.toLowerCase())
				for (const trap of traps) {
					expect(trap.toLowerCase(), `${sentence.id}: ${key}`).not.toBe(
						key.toLowerCase(),
					)
				}
			}
		}
	})
})

describe('defineTopic', () => {
	test('illustrates a one-line rule with the first three sentences', () => {
		const sentences = ['a', 'b', 'c', 'd'].map((id) => ({
			id,
			form: 'affirmative' as const,
			prompt: `prompt ${id}`,
			answer: `answer ${id}`,
		}))
		const topic = defineTopic({
			id: 't',
			level: 'beginner',
			title: 'T',
			subtitle: 'Т',
			rule: 'Explanation',
			sentences,
		})
		expect(topic.rule).toEqual([
			{
				kind: 'usage',
				explanation: 'Explanation',
				examples: ['a', 'b', 'c'].map((id) => ({
					text: `answer ${id}`,
					translation: `prompt ${id}`,
				})),
			},
		])
	})
})

describe('local topic source', () => {
	const source = createLocalTopicSource(ALL_TOPICS, seededRandom(1))

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

	test('returns a topic with its rule but not its sentence bank', async () => {
		const topic = await source.getTopic('present-simple')
		expect(topic.title).toBe('Present Simple')
		expect(topic.rule.length).toBeGreaterThan(0)
		expect(topic).not.toHaveProperty('sentences')
	})

	test('returns a round of sentences from the topic', async () => {
		const bank = ALL_TOPICS.find((topic) => topic.id === 'present-simple')
		const round = await source.getRound('present-simple', 1)
		expect(round.topicId).toBe('present-simple')
		expect(round.sentences).toHaveLength(1)
		expect(bank?.sentences).toContainEqual(round.sentences[0])
	})

	test('rejects unknown topic ids', async () => {
		await expect(source.getTopic('nope')).rejects.toBeInstanceOf(
			TopicNotFoundError,
		)
		await expect(source.getRound('nope')).rejects.toBeInstanceOf(
			TopicNotFoundError,
		)
	})
})
