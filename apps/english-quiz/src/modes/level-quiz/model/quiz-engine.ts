import type { QuizLevel, QuizResult } from '@my-time/mfe-contracts'
import { formatISO } from 'date-fns'
import { type RandomSource, shuffle } from '../../../shared/lib/random'
import type { Question } from './types'

export const QUESTIONS_PER_QUIZ = 8

export interface QuizState {
	level: QuizLevel
	questions: readonly Question[]
	index: number
	/** Option chosen for the current question, or null until answered. */
	selected: number | null
	correct: number
	finished: boolean
}

/** Shuffles answer options and remaps the correct index accordingly. */
function shuffleOptions(question: Question, random: RandomSource): Question {
	const order = shuffle(
		question.options.map((_, index) => index),
		random,
	)
	return {
		...question,
		options: order.map((index) => question.options[index] as string),
		answerIndex: order.indexOf(question.answerIndex),
	}
}

export function startQuiz(
	level: QuizLevel,
	bank: readonly Question[],
	random: RandomSource = Math.random,
): QuizState {
	const questions = shuffle(
		bank.filter((question) => question.level === level),
		random,
	)
		.slice(0, QUESTIONS_PER_QUIZ)
		.map((question) => shuffleOptions(question, random))

	if (questions.length === 0) {
		throw new Error(`No questions available for level ${level}`)
	}

	return {
		level,
		questions,
		index: 0,
		selected: null,
		correct: 0,
		finished: false,
	}
}

export function currentQuestion(state: QuizState): Question {
	return state.questions[state.index] as Question
}

/** Records an answer for the current question. Re-answering is ignored. */
export function answer(state: QuizState, optionIndex: number): QuizState {
	if (state.finished || state.selected !== null) return state
	const isCorrect = currentQuestion(state).answerIndex === optionIndex
	return {
		...state,
		selected: optionIndex,
		correct: state.correct + (isCorrect ? 1 : 0),
	}
}

/** Moves to the next question, or finishes the quiz after the last one. */
export function next(state: QuizState): QuizState {
	if (state.finished || state.selected === null) return state
	const isLast = state.index === state.questions.length - 1
	return isLast
		? { ...state, finished: true }
		: { ...state, index: state.index + 1, selected: null }
}

export function toResult(state: QuizState, completedAt: Date): QuizResult {
	return {
		level: state.level,
		correct: state.correct,
		total: state.questions.length,
		completedAt: formatISO(completedAt),
	}
}
