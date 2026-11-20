import { describe, expect, test } from 'bun:test'
import { ENGLISH_QUIZ_MODES } from '@my-time/micro-frontends'
import {
	ENGLISH_QUIZ_MODE_PARAM,
	validateEnglishQuizSearch,
} from './english-quiz-search'

describe('validateEnglishQuizSearch', () => {
	test.each(ENGLISH_QUIZ_MODES)('keeps the known mode %s', (mode) => {
		expect(
			validateEnglishQuizSearch({ [ENGLISH_QUIZ_MODE_PARAM]: mode }),
		).toEqual({ [ENGLISH_QUIZ_MODE_PARAM]: mode })
	})

	test('drops unknown or missing modes', () => {
		for (const search of [
			{ [ENGLISH_QUIZ_MODE_PARAM]: 'removed-mode' },
			{ [ENGLISH_QUIZ_MODE_PARAM]: 42 },
			{},
		]) {
			const validated = validateEnglishQuizSearch(search)
			expect(Object.hasOwn(validated, ENGLISH_QUIZ_MODE_PARAM)).toBe(true)
			expect(validated.mode).toBeUndefined()
		}
	})
})
