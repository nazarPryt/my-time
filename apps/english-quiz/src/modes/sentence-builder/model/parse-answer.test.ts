import { describe, expect, test } from 'bun:test'
import { answerWords, formatAnswer, parseAnswer } from './parse-answer'

const words = (answer: string) => answerWords(parseAnswer(answer))

describe('parseAnswer', () => {
	test('keeps the final punctuation apart from the last word', () => {
		expect(parseAnswer('How do you play?')).toEqual([
			{ word: 'How', before: '', after: '' },
			{ word: 'do', before: '', after: '' },
			{ word: 'you', before: '', after: '' },
			{ word: 'play', before: '', after: '?' },
		])
	})

	test('takes commas off words, so tiles never show them', () => {
		expect(parseAnswer('Yes, I do.')).toEqual([
			{ word: 'Yes', before: '', after: ',' },
			{ word: 'I', before: '', after: '' },
			{ word: 'do', before: '', after: '.' },
		])
	})

	test('keeps apostrophes and hyphens inside words', () => {
		expect(words("She doesn't have twenty-one cats.")).toEqual([
			'She',
			"doesn't",
			'have',
			'twenty-one',
			'cats',
		])
	})

	test('keeps the dots of abbreviations', () => {
		expect(parseAnswer('Mr. Smith left at 7 a.m.')).toEqual([
			{ word: 'Mr.', before: '', after: '' },
			{ word: 'Smith', before: '', after: '' },
			{ word: 'left', before: '', after: '' },
			{ word: 'at', before: '', after: '' },
			{ word: '7', before: '', after: '' },
			{ word: 'a.m.', before: '', after: '' },
		])
		expect(parseAnswer('It is Dr.,')[2]).toEqual({
			word: 'Dr.',
			before: '',
			after: ',',
		})
	})

	test('separates quotes around words', () => {
		expect(parseAnswer('He said "hello."')).toEqual([
			{ word: 'He', before: '', after: '' },
			{ word: 'said', before: '', after: '' },
			{ word: 'hello', before: '"', after: '."' },
		])
	})

	test('glues detached punctuation to a neighbouring word', () => {
		expect(parseAnswer('Stop !')).toEqual([
			{ word: 'Stop', before: '', after: '!' },
		])
		expect(parseAnswer('" Hi')).toEqual([
			{ word: 'Hi', before: '"', after: '' },
		])
	})

	test('ignores extra spaces', () => {
		expect(words('  I   am here ')).toEqual(['I', 'am', 'here'])
	})

	test('formats tokens back into the sentence', () => {
		for (const answer of [
			'Yes, I do.',
			'He said "hello."',
			'Mr. Smith left.',
		]) {
			expect(formatAnswer(parseAnswer(answer))).toBe(answer)
		}
	})
})
