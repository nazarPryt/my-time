import { describe, expect, test } from 'bun:test'
import { contractionVariants } from './contractions'
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
	})

	test('keeps the capital and the punctuation in place', () => {
		expect(variants("Don't be late!")).toEqual([
			"Don't be late!",
			'Do not be late!',
		])
		expect(variants('I am at home.')).toEqual(['I am at home.', "I'm at home."])
	})

	test('does not expand negatives in questions', () => {
		expect(variants("Why don't you come?")).toEqual(["Why don't you come?"])
		expect(variants("Doesn't she know?")).toEqual(["Doesn't she know?"])
	})

	test('swaps pronoun contractions in questions too', () => {
		expect(variants("Why aren't you sure I'm here?")).toEqual([
			"Why aren't you sure I'm here?",
			"Why aren't you sure I am here?",
		])
	})

	test('combines several contractions', () => {
		expect(variants("I'm sure he won't come.")).toEqual([
			"I'm sure he won't come.",
			"I'm sure he will not come.",
			"I am sure he won't come.",
			'I am sure he will not come.',
		])
	})

	test('leaves ambiguous and unrelated words alone', () => {
		expect(variants("It's late and she'd go.")).toEqual([
			"It's late and she'd go.",
		])
		expect(variants('She does her homework.')).toEqual([
			'She does her homework.',
		])
	})

	test('never contracts at the end of a clause', () => {
		expect(variants('Yes, I am.')).toEqual(['Yes, I am.'])
		expect(variants('I know you are, but I am not.')).toEqual([
			'I know you are, but I am not.',
			"I know you are, but I'm not.",
		])
	})

	test("expands 've but never contracts a main-verb have", () => {
		expect(variants("I've got a car.")).toEqual([
			"I've got a car.",
			'I have got a car.',
		])
		expect(variants('I have a car.')).toEqual(['I have a car.'])
	})
})
