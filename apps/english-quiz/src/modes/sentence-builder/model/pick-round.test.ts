import { describe, expect, test } from 'bun:test'
import { seededRandom } from '../../../shared/lib/random'
import { pickRound } from './pick-round'
import type { Sentence, SentenceForm } from './types'

function bank(counts: Record<SentenceForm, number>): Sentence[] {
	return Object.entries(counts).flatMap(([form, count]) =>
		Array.from({ length: count }, (_, index) => ({
			id: `${form}-${index}`,
			form: form as SentenceForm,
			prompt: '',
			answer: '',
		})),
	)
}

const countForm = (sentences: readonly Sentence[], form: SentenceForm) =>
	sentences.filter((sentence) => sentence.form === form).length

describe('pickRound', () => {
	test('picks `size` distinct sentences from a larger bank', () => {
		const round = pickRound(
			bank({ affirmative: 40, question: 30, negative: 30 }),
			10,
			seededRandom(1),
		)
		expect(round).toHaveLength(10)
		expect(new Set(round.map((sentence) => sentence.id)).size).toBe(10)
	})

	test('balances the forms', () => {
		const round = pickRound(
			bank({ affirmative: 60, question: 20, negative: 20 }),
			9,
			seededRandom(2),
		)
		expect(countForm(round, 'affirmative')).toBe(3)
		expect(countForm(round, 'question')).toBe(3)
		expect(countForm(round, 'negative')).toBe(3)
	})

	test('fills up from other forms when one runs out', () => {
		const round = pickRound(
			bank({ affirmative: 20, question: 1, negative: 0 }),
			10,
			seededRandom(3),
		)
		expect(round).toHaveLength(10)
		expect(countForm(round, 'question')).toBe(1)
	})

	test('returns the whole bank when it is smaller than the round', () => {
		const small = bank({ affirmative: 1, question: 1, negative: 1 })
		const round = pickRound(small, 10, seededRandom(4))
		expect(round.map((s) => s.id).sort()).toEqual(small.map((s) => s.id).sort())
	})

	test('differs between attempts', () => {
		const big = bank({ affirmative: 40, question: 30, negative: 30 })
		const first = pickRound(big, 10, seededRandom(5)).map((s) => s.id)
		const second = pickRound(big, 10, seededRandom(6)).map((s) => s.id)
		expect(first).not.toEqual(second)
	})
})
