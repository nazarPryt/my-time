import { describe, expect, test } from 'bun:test'
import { seededRandom } from 'contracts/english-quiz'
import { formatISO } from 'date-fns'
import { QUESTION_BANK } from '../data/questions'
import {
	answer,
	currentQuestion,
	next,
	QUESTIONS_PER_QUIZ,
	startQuiz,
	toResult,
} from './quiz-engine'

function answerAll(level: 'A2' | 'B1' | 'B2', pickCorrect: boolean) {
	let state = startQuiz(level, QUESTION_BANK, seededRandom(1))
	while (!state.finished) {
		const question = currentQuestion(state)
		const wrong = (question.answerIndex + 1) % question.options.length
		state = next(answer(state, pickCorrect ? question.answerIndex : wrong))
	}
	return state
}

describe('quiz engine', () => {
	test('picks only questions of the requested level', () => {
		const state = startQuiz('B2', QUESTION_BANK, seededRandom(42))
		expect(state.questions).toHaveLength(QUESTIONS_PER_QUIZ)
		expect(state.questions.every((q) => q.level === 'B2')).toBe(true)
	})

	test('keeps the correct answer after shuffling options', () => {
		const state = startQuiz('A2', QUESTION_BANK, seededRandom(7))
		for (const shuffled of state.questions) {
			const original = QUESTION_BANK.find((q) => q.id === shuffled.id)
			expect(shuffled.options[shuffled.answerIndex]).toBe(
				original?.options[original.answerIndex] as string,
			)
		}
	})

	test('counts correct answers and finishes after the last question', () => {
		const perfect = answerAll('B1', true)
		expect(perfect.finished).toBe(true)
		expect(perfect.correct).toBe(QUESTIONS_PER_QUIZ)

		const zero = answerAll('B1', false)
		expect(zero.correct).toBe(0)
	})

	test('ignores a second answer to the same question', () => {
		const state = startQuiz('A2', QUESTION_BANK, seededRandom(3))
		const right = currentQuestion(state).answerIndex
		const once = answer(state, right)
		const twice = answer(once, (right + 1) % 4)
		expect(twice).toBe(once)
		expect(twice.correct).toBe(1)
	})

	test('cannot skip a question without answering', () => {
		const state = startQuiz('A2', QUESTION_BANK, seededRandom(3))
		expect(next(state)).toBe(state)
	})

	test('builds the result reported to the host', () => {
		const state = answerAll('B2', true)
		const completedAt = new Date('2026-11-12T10:00:00.000Z')
		expect(toResult(state, completedAt)).toEqual({
			level: 'B2',
			correct: QUESTIONS_PER_QUIZ,
			total: QUESTIONS_PER_QUIZ,
			completedAt: formatISO(completedAt),
		})
	})

	test('every question in the bank has a valid answer index', () => {
		for (const q of QUESTION_BANK) {
			expect(q.answerIndex).toBeGreaterThanOrEqual(0)
			expect(q.answerIndex).toBeLessThan(q.options.length)
		}
	})
})
