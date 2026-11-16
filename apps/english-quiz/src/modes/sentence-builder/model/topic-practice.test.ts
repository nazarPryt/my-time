import { describe, expect, test } from 'bun:test'
import {
	completeSentence,
	currentIndex,
	isFinished,
	progressDots,
	score,
	startPractice,
} from './topic-practice'

describe('topic practice', () => {
	test('advances one sentence at a time and finishes after the last', () => {
		let state = startPractice(2)
		expect(currentIndex(state)).toBe(0)
		state = completeSentence(state, true)
		expect(currentIndex(state)).toBe(1)
		expect(isFinished(state)).toBe(false)
		state = completeSentence(state, false)
		expect(isFinished(state)).toBe(true)
		expect(completeSentence(state, true)).toBe(state)
	})

	test('scores only sentences solved on the first try', () => {
		let state = startPractice(3)
		state = completeSentence(state, true)
		state = completeSentence(state, false)
		state = completeSentence(state, true)
		expect(score(state)).toBe(2)
	})

	test('describes every progress dot', () => {
		let state = startPractice(4)
		state = completeSentence(state, true)
		state = completeSentence(state, false)
		expect(progressDots(state)).toEqual([
			'first-try',
			'after-mistakes',
			'current',
			'upcoming',
		])
	})
})
