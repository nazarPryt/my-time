import { describe, expect, test } from 'bun:test'
import type { Round, Topic, TopicSummary } from '../model/types'
import { createHttpTopicSource, TopicNotFoundError } from './topic-source'

const SUMMARY: TopicSummary = {
	id: 'present-simple',
	level: 'beginner',
	title: 'Present Simple',
	subtitle: 'Теперішній простий час',
}
const TOPIC: Topic = { ...SUMMARY, rule: [] }
const ROUND: Round = {
	topicId: SUMMARY.id,
	sentences: [
		{ id: 's-1', form: 'affirmative', prompt: 'Я граю.', answer: 'I play.' },
	],
}

function fakeApi(routes: Record<string, unknown>) {
	const requested: string[] = []
	const apiFetch = async (path: string) => {
		requested.push(path)
		return path in routes
			? new Response(JSON.stringify(routes[path]))
			: new Response('{}', { status: 404 })
	}
	return { source: createHttpTopicSource(apiFetch), requested }
}

describe('HTTP topic source', () => {
	test('maps each method to its endpoint', async () => {
		const { source, requested } = fakeApi({
			'/english-quiz/topics': [SUMMARY],
			'/english-quiz/topics/present-simple': TOPIC,
			'/english-quiz/topics/present-simple/round?size=10': ROUND,
		})
		expect(await source.listTopics()).toEqual([SUMMARY])
		expect(await source.getTopic(SUMMARY.id)).toEqual(TOPIC)
		expect(await source.getRound(SUMMARY.id)).toEqual(ROUND)
		expect(requested).toHaveLength(3)
	})

	test('rejects unknown topic ids with TopicNotFoundError', async () => {
		const { source } = fakeApi({})
		await expect(source.getTopic('nope')).rejects.toBeInstanceOf(
			TopicNotFoundError,
		)
		await expect(source.getRound('nope')).rejects.toBeInstanceOf(
			TopicNotFoundError,
		)
	})

	test('rejects a failed request and a malformed body', async () => {
		const failing = createHttpTopicSource(
			async () => new Response('', { status: 500 }),
		)
		await expect(failing.listTopics()).rejects.toThrow('500')

		const { source } = fakeApi({ '/english-quiz/topics': [{ id: 1 }] })
		await expect(source.listTopics()).rejects.toThrow()
	})
})
