import { describe, expect, test } from 'bun:test'
import type { Sentence } from 'contracts'
import { defineTopic, type TopicRecord } from '../content/define-topic'
import { ALL_TOPICS } from '../content/index'
import { findContentProblems } from '../content/validate-content'

function sentence(overrides: Partial<Sentence> = {}): Sentence {
	return {
		id: 's-1',
		form: 'affirmative',
		prompt: 'Я граю.',
		answer: 'I play.',
		...overrides,
	}
}

function topic(sentences: Sentence[], overrides: Partial<TopicRecord> = {}) {
	return defineTopic({
		id: 't',
		level: 'beginner',
		title: 'T',
		subtitle: 'Т',
		rule: 'Explanation',
		sentences,
		...overrides,
	})
}

const problemsOf = (...sentences: Sentence[]) =>
	findContentProblems([topic(sentences)])

describe('topic files', () => {
	test('follow every content rule', () => {
		expect(findContentProblems(ALL_TOPICS)).toEqual([])
	})
})

describe('findContentProblems', () => {
	test('accepts a valid topic', () => {
		expect(problemsOf(sentence())).toEqual([])
	})

	test('rejects duplicate topic and sentence ids', () => {
		const first = topic([sentence()])
		expect(findContentProblems([first, first])).toEqual([
			'topic id "t" is used more than once',
			'sentence id "s-1" is used more than once',
		])
	})

	test('rejects a topic without sentences or rule examples', () => {
		const empty = topic([], {
			rule: [{ kind: 'usage', explanation: 'x', examples: [] }],
		})
		expect(findContentProblems([empty])).toEqual([
			'topic "t": no sentences',
			'topic "t": a rule section has no examples',
		])
	})

	test('rejects a one-word answer', () => {
		expect(problemsOf(sentence({ answer: 'Play!' }))).toEqual([
			'sentence "s-1": answer needs at least two words',
		])
	})

	test('rejects broken or useless accept patterns', () => {
		expect(problemsOf(sentence({ accept: ['I {play.'] }))[0]).toContain(
			'Invalid answer pattern',
		)
		expect(problemsOf(sentence({ accept: ['I play.'] }))).toEqual([
			'sentence "s-1": accept adds nothing beyond contractions',
		])
	})

	test('rejects an accepted answer that starts another', () => {
		expect(problemsOf(sentence({ accept: ['I play {it|}.'] }))).toEqual([
			'sentence "s-1": "I play" is the start of "I play it"',
		])
	})

	test('rejects traps that are not answer words or repeat them', () => {
		expect(
			problemsOf(sentence({ traps: { run: ['ran'], play: ['Play'] } })),
		).toEqual([
			'sentence "s-1": trap key "run" is not a word of the answer',
			'sentence "s-1": trap for "play" repeats the word itself',
		])
	})
})

describe('defineTopic', () => {
	test('illustrates a one-line rule with the first three sentences', () => {
		const sentences = ['a', 'b', 'c', 'd'].map((id) =>
			sentence({ id, prompt: `prompt ${id}`, answer: `answer ${id}` }),
		)
		expect(topic(sentences).rule).toEqual([
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
