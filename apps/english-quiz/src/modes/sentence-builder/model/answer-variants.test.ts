import { describe, expect, test } from 'bun:test'
import {
	acceptedAnswers,
	expandVariants,
	MAX_VARIANTS,
	VariantSyntaxError,
} from './answer-variants'
import { answerWords } from './parse-answer'

describe('expandVariants', () => {
	test('returns a pattern without groups unchanged', () => {
		expect(expandVariants('I know.')).toEqual(['I know.'])
	})

	test('expands every combination of the groups, in order', () => {
		expect(expandVariants("I {don't|do not} like {cats|dogs}.")).toEqual([
			"I don't like cats.",
			"I don't like dogs.",
			'I do not like cats.',
			'I do not like dogs.',
		])
	})

	test('treats an empty option as optional words', () => {
		expect(expandVariants('I {|really} like it.')).toEqual([
			'I like it.',
			'I really like it.',
		])
	})

	test('rejects broken patterns', () => {
		for (const pattern of [
			'I {know.',
			'I know}.',
			'I {a|{b|c}}.',
			'I {know}.',
		]) {
			expect(() => expandVariants(pattern), pattern).toThrow(VariantSyntaxError)
		}
	})

	test('rejects a pattern with too many variants', () => {
		const pattern = Array.from({ length: 7 }, () => '{a|b}').join(' ')
		expect(2 ** 7).toBeGreaterThan(MAX_VARIANTS)
		expect(() => expandVariants(pattern)).toThrow(VariantSyntaxError)
	})
})

describe('acceptedAnswers', () => {
	const words = (sentence: { answer: string; accept?: string[] }) =>
		acceptedAnswers(sentence).map(answerWords)

	test('puts the canonical answer first, then contractions and patterns', () => {
		expect(
			words({
				answer: "I don't like films.",
				accept: ["I don't like movies."],
			}),
		).toEqual([
			['I', "don't", 'like', 'films'],
			['I', 'do', 'not', 'like', 'films'],
			['I', "don't", 'like', 'movies'],
			['I', 'do', 'not', 'like', 'movies'],
		])
	})

	test('drops duplicates, ignoring punctuation', () => {
		expect(
			words({
				answer: 'Yes, I do.',
				accept: ['Yes I do!', '{Yes|Yeah}, I do.'],
			}),
		).toEqual([
			['Yes', 'I', 'do'],
			['Yeah', 'I', 'do'],
		])
	})
})
