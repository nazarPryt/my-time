import { describe, expect, test } from 'bun:test'
import { parseAnswer } from './parse-answer'

describe('parseAnswer', () => {
	test('splits words and keeps the final punctuation apart', () => {
		expect(parseAnswer('How do you play?')).toEqual({
			words: ['How', 'do', 'you', 'play'],
			ending: '?',
		})
	})

	test('keeps apostrophes and inner punctuation inside words', () => {
		expect(parseAnswer("Yes, I don't know.")).toEqual({
			words: ['Yes,', 'I', "don't", 'know'],
			ending: '.',
		})
	})

	test('works without final punctuation and with extra spaces', () => {
		expect(parseAnswer('  I   am here ')).toEqual({
			words: ['I', 'am', 'here'],
			ending: '',
		})
	})

	test('drops a detached final punctuation token', () => {
		expect(parseAnswer('Stop !')).toEqual({ words: ['Stop'], ending: '!' })
	})
})
