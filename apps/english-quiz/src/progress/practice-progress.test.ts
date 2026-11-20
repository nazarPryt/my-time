import { describe, expect, test } from 'bun:test'
import {
	ENGLISH_QUIZ_MODES,
	QUIZ_LEVELS,
	type QuizResult,
} from '@my-time/micro-frontends'
import {
	EMPTY_PROGRESS,
	parseProgress,
	scoreFromEvent,
	withScore,
} from './practice-progress'

const [modeA, modeB] = ENGLISH_QUIZ_MODES
const result: QuizResult = {
	level: QUIZ_LEVELS[0],
	correct: 6,
	total: 8,
	completedAt: '2026-11-16T10:00:00.000Z',
}

describe('withScore', () => {
	test('replaces the mode score and keeps the others', () => {
		const progress = withScore(
			withScore(
				withScore(EMPTY_PROGRESS, modeA, { correct: 1, total: 2 }),
				modeB,
				{ correct: 3, total: 4 },
			),
			modeA,
			{ correct: 2, total: 2 },
		)
		expect(progress.scores).toEqual({
			[modeA]: { correct: 2, total: 2 },
			[modeB]: { correct: 3, total: 4 },
		})
	})
})

describe('scoreFromEvent', () => {
	test('takes the score of a completed quiz', () => {
		expect(scoreFromEvent({ type: 'quiz-completed', result })).toEqual({
			correct: 6,
			total: 8,
		})
	})

	test('ignores other events', () => {
		expect(scoreFromEvent({ type: 'mode-changed', mode: null })).toBeNull()
	})
})

describe('parseProgress', () => {
	test('round-trips saved progress', () => {
		const saved = withScore(EMPTY_PROGRESS, modeA, { correct: 2, total: 8 })
		expect(parseProgress(JSON.parse(JSON.stringify(saved)))).toEqual(saved)
	})

	test('drops unknown modes and malformed scores', () => {
		expect(
			parseProgress({
				scores: {
					'removed-mode': { correct: 1, total: 1 },
					[modeA]: { correct: 9, total: 1 },
					[modeB]: { correct: 'x', total: 1 },
				},
			}),
		).toEqual(EMPTY_PROGRESS)
	})

	test('falls back to empty progress for non-objects', () => {
		expect(parseProgress(null)).toEqual(EMPTY_PROGRESS)
		expect(parseProgress('nope')).toEqual(EMPTY_PROGRESS)
	})
})
