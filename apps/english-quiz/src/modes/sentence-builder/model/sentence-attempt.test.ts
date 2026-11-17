import { describe, expect, test } from 'bun:test'
import { parseAnswer } from './parse-answer'
import {
	type AttemptState,
	checkWords,
	INITIAL_ATTEMPT,
	pickWord,
	retryAttempt,
	undoWord,
} from './sentence-attempt'

const WORDS = ['How', 'do', 'you', 'play']

function pickAll(words: readonly string[], state = INITIAL_ATTEMPT) {
	return words.reduce<AttemptState>(
		(current, word) => pickWord(current, WORDS, word),
		state,
	)
}

describe('sentence attempt', () => {
	test('completes the sentence when every word is picked in order', () => {
		const state = pickAll(WORDS)
		expect(state.status).toBe('correct')
		expect(state.picked).toEqual(WORDS)
		expect(state.mistakes).toBe(0)
	})

	test('keeps building after a wrong word', () => {
		const state = pickAll(['How', 'did', 'you'])
		expect(state.status).toBe('building')
		expect(state.picked).toEqual(['How', 'did', 'you'])
		expect(state.mistakes).toBe(0)
	})

	test('checks the whole sentence when the last word is placed', () => {
		const state = pickAll(['How', 'did', 'it', 'play'])
		expect(state.status).toBe('wrong')
		expect(state.picked).toEqual(['How', 'did', 'it', 'play'])
		expect(state.mistakes).toBe(1)
	})

	test('ignores picks once the sentence is checked', () => {
		const wrong = pickAll(['How', 'did', 'you', 'play'])
		expect(pickWord(wrong, WORDS, 'do')).toBe(wrong)
		const done = pickAll(WORDS)
		expect(pickWord(done, WORDS, 'do')).toBe(done)
	})

	test('retry starts the same sentence over and keeps the mistake count', () => {
		const retried = retryAttempt(pickAll(['How', 'did', 'you', 'play']))
		expect(retried).toEqual({ ...INITIAL_ATTEMPT, mistakes: 1 })
		expect(pickAll(WORDS, retried)).toMatchObject({
			status: 'correct',
			mistakes: 1,
		})
	})

	test('undo removes the last picked word only while building', () => {
		const state = pickAll(['How', 'did'])
		expect(undoWord(state).picked).toEqual(['How'])
		expect(undoWord(INITIAL_ATTEMPT)).toBe(INITIAL_ATTEMPT)
		const done = pickAll(WORDS)
		expect(undoWord(done)).toBe(done)
		const wrong = pickAll(['How', 'did', 'you', 'play'])
		expect(undoWord(wrong)).toBe(wrong)
	})

	test('retry does nothing unless the attempt is wrong', () => {
		expect(retryAttempt(INITIAL_ATTEMPT)).toBe(INITIAL_ATTEMPT)
	})
})

describe('checkWords', () => {
	test('marks every slot that differs from the answer', () => {
		expect(
			checkWords(['Yes', 'it', 'plays'], parseAnswer('Yes, you play.')),
		).toEqual([
			{ picked: 'Yes', expected: 'Yes', correct: true, before: '', after: ',' },
			{ picked: 'it', expected: 'you', correct: false, before: '', after: '' },
			{
				picked: 'plays',
				expected: 'play',
				correct: false,
				before: '',
				after: '.',
			},
		])
	})
})
