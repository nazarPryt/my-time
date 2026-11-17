import { describe, expect, test } from 'bun:test'
import { contractionVariants, MAX_CONTRACTION_VARIANTS } from './contractions'
import { formatAnswer, parseAnswer } from './parse-answer'

const variants = (answer: string) =>
	contractionVariants(parseAnswer(answer)).map(formatAnswer)

describe('contractionVariants', () => {
	test('expands a negative contraction, keeping the original first', () => {
		expect(variants("He doesn't need help.")).toEqual([
			"He doesn't need help.",
			'He does not need help.',
		])
	})

	test('contracts a full negative form', () => {
		expect(variants('They do not eat meat.')).toEqual([
			'They do not eat meat.',
			"They don't eat meat.",
		])
		expect(variants('I cannot swim.')).toEqual([
			'I cannot swim.',
			"I can't swim.",
		])
	})

	test('keeps the capital and the punctuation in place', () => {
		expect(variants("Don't be late!")).toEqual([
			"Don't be late!",
			'Do not be late!',
		])
	})

	test('does not swap negatives in questions', () => {
		expect(variants("Why don't you come?")).toEqual(["Why don't you come?"])
		expect(variants("Doesn't she know?")).toEqual(["Doesn't she know?"])
	})

	test('expands pronoun contractions, in questions too', () => {
		expect(variants("I'm at home.")).toEqual(["I'm at home.", 'I am at home.'])
		expect(variants("Are you sure I'm right?")).toEqual([
			"Are you sure I'm right?",
			'Are you sure I am right?',
		])
	})

	test('never creates a pronoun contraction', () => {
		// Each of these would be wrong English: "Yes, I'm.", "who you're and",
		// "Here we're now.", "I've a car".
		for (const answer of [
			'Yes, I am.',
			'I know who you are and what you want.',
			'Here we are now.',
			'I have a car.',
			'I am at home.',
		]) {
			expect(variants(answer), answer).toEqual([answer])
		}
	})

	test('reaches the negative form behind a pronoun or will', () => {
		expect(variants('I will not go.')).toEqual([
			'I will not go.',
			"I won't go.",
		])
		expect(variants("They're not ready.")).toEqual([
			"They're not ready.",
			'They are not ready.',
			"They aren't ready.",
		])
		expect(variants("I'll not go.")).toContain("I won't go.")
	})

	test('never contracts across punctuation', () => {
		expect(variants('If you do, not only you win.')).toEqual([
			'If you do, not only you win.',
		])
	})

	test('combines several contractions', () => {
		expect(variants("I'm sure he won't come.")).toEqual([
			"I'm sure he won't come.",
			"I am sure he won't come.",
			"I'm sure he will not come.",
			'I am sure he will not come.',
		])
	})

	test('caps the list, dropping the most rewritten variants first', () => {
		const answer =
			"I don't know, he doesn't care, we didn't ask, they aren't here, it isn't late."
		const all = variants(answer)
		expect(all).toHaveLength(MAX_CONTRACTION_VARIANTS)
		expect(all[0]).toBe(answer)
		// Each single expansion is kept, including the first contraction's.
		for (const [short, long] of [
			["don't", 'do not'],
			["doesn't", 'does not'],
			["didn't", 'did not'],
			["aren't", 'are not'],
			["isn't", 'is not'],
		]) {
			expect(all).toContain(answer.replace(short as string, long as string))
		}
	})

	test('leaves ambiguous and unrelated words alone', () => {
		expect(variants("It's late and she'd go.")).toEqual([
			"It's late and she'd go.",
		])
		expect(variants('She does her homework.')).toEqual([
			'She does her homework.',
		])
	})
})
