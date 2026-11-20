import type { Sentence } from '../schemas'
import { contractionVariants } from './contractions'
import { type AnswerToken, answerWords, parseAnswer } from './parse-answer'

/** Guards against a pattern whose groups multiply into a huge list. */
export const MAX_VARIANTS = 64

export class VariantSyntaxError extends Error {
	constructor(pattern: string, reason: string) {
		super(`Invalid answer pattern "${pattern}": ${reason}`)
		this.name = 'VariantSyntaxError'
	}
}

const GROUP = /\{([^{}]*)\}/g

/**
 * Expands "I {really|} like {films|movies}." into every sentence it
 * describes: each `{a|b}` group is one choice, and an empty option makes the
 * words optional. Groups cannot be nested. Each result starts with a capital,
 * so "{Please|} sit down." gives "Please sit down." and "Sit down.".
 */
export function expandVariants(pattern: string): string[] {
	const groups = [...pattern.matchAll(GROUP)]
	if (/[{}]/.test(pattern.replace(GROUP, ''))) {
		throw new VariantSyntaxError(pattern, 'unbalanced or nested braces')
	}

	let variants = ['']
	let cursor = 0
	for (const group of groups) {
		const options = (group[1] ?? '').split('|')
		if (options.length < 2) {
			throw new VariantSyntaxError(pattern, `"${group[0]}" has one option`)
		}
		const text = pattern.slice(cursor, group.index)
		variants = variants.flatMap((variant) =>
			options.map((option) => variant + text + option),
		)
		if (variants.length > MAX_VARIANTS) {
			throw new VariantSyntaxError(
				pattern,
				`more than ${MAX_VARIANTS} variants`,
			)
		}
		cursor = group.index + group[0].length
	}
	const tail = pattern.slice(cursor)
	return variants.map((variant) =>
		capitalize((variant + tail).replace(/\s+/g, ' ').trim()),
	)
}

function capitalize(sentence: string): string {
	return sentence.replace(/\p{L}/u, (letter) => letter.toUpperCase())
}

/**
 * Two accepted answers where one is the start of the other ("I know" and
 * "I know it"), or null. The builder has no "check" button: a sentence is
 * done once it equals an accepted answer, so the longer one could never be
 * built. Content must never contain such a pair.
 */
export function findPrefixConflict(
	answers: readonly (readonly string[])[],
): readonly [string, string] | null {
	for (const shorter of answers) {
		for (const longer of answers) {
			if (
				longer.length > shorter.length &&
				shorter.every((word, index) => word === longer[index])
			) {
				return [shorter.join(' '), longer.join(' ')]
			}
		}
	}
	return null
}

/**
 * Every answer the learner may build, as tokens: the canonical `answer`
 * first, then the expanded `accept` patterns, each also with its
 * contractions swapped ("doesn't" ↔ "does not"), without duplicates.
 */
export function acceptedAnswers(
	sentence: Pick<Sentence, 'answer' | 'accept'>,
): AnswerToken[][] {
	const seen = new Set<string>()
	const answers: AnswerToken[][] = []
	const texts = [
		sentence.answer,
		...(sentence.accept ?? []).flatMap(expandVariants),
	]
	for (const text of texts) {
		for (const tokens of contractionVariants(parseAnswer(text))) {
			const key = answerWords(tokens).join(' ')
			if (seen.has(key)) continue
			seen.add(key)
			answers.push(tokens)
		}
	}
	return answers
}
