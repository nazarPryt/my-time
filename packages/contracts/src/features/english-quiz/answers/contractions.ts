import { type AnswerToken, answerWords } from './parse-answer'

/**
 * [short, long] pairs, only ever expanded: "I'm" → "I am" is always right,
 * but the reverse is wrong at a clause end ("Yes, I am.", "who you are and
 * …") and for a main-verb have ("I have a car" ≠ "I've a car").
 */
const EXPAND_ONLY: readonly (readonly [string, string])[] = [
	["I'm", 'I am'],
	["you're", 'you are'],
	["we're", 'we are'],
	["they're", 'they are'],
	["I'll", 'I will'],
	["you'll", 'you will'],
	["he'll", 'he will'],
	["she'll", 'she will'],
	["we'll", 'we will'],
	["they'll", 'they will'],
	["I've", 'I have'],
	["you've", 'you have'],
	["we've", 'we have'],
	["they've", 'they have'],
]

/**
 * [short, long] pairs swapped both ways, but not in questions: "Why don't
 * you…?" cannot become "Why do not you…?". Ambiguous forms ('s = is/has,
 * 'd = had/would) are deliberately missing; list those as `accept` patterns.
 */
const BOTH_WAYS: readonly (readonly [string, string])[] = [
	["don't", 'do not'],
	["doesn't", 'does not'],
	["didn't", 'did not'],
	["isn't", 'is not'],
	["aren't", 'are not'],
	["wasn't", 'was not'],
	["weren't", 'were not'],
	["haven't", 'have not'],
	["hasn't", 'has not'],
	["hadn't", 'had not'],
	["won't", 'will not'],
	["can't", 'cannot'],
	["couldn't", 'could not'],
	["shouldn't", 'should not'],
	["wouldn't", 'would not'],
	["mustn't", 'must not'],
]

/** Guards against a sentence full of contractions multiplying out. */
export const MAX_CONTRACTION_VARIANTS = 16

interface Pair {
	short: string
	long: readonly string[]
	contracts: boolean
}

function toPairs(
	list: readonly (readonly [string, string])[],
	contracts: boolean,
): Pair[] {
	return list.map(([short, long]) => ({
		short,
		long: long.split(' '),
		contracts,
	}))
}

const ALWAYS = toPairs(EXPAND_ONLY, false)
const OUTSIDE_QUESTIONS = toPairs(BOTH_WAYS, true)

/** Keeps a capital at the start of the sentence: "Don't" ↔ "Do not". */
function matchCase(word: string, like: string): string {
	const upper = like.charAt(0) !== like.charAt(0).toLowerCase()
	return upper ? word.charAt(0).toUpperCase() + word.slice(1) : word
}

function sameWord(a: string, b: string): boolean {
	return a.toLowerCase() === b.toLowerCase()
}

/** "do" "not" contract only when no punctuation separates them. */
function isLongForm(run: readonly AnswerToken[], long: readonly string[]) {
	return (
		run.length === long.length &&
		run.every(
			(token, position) =>
				sameWord(token.word, long[position] ?? '') &&
				(position === 0 || token.before === '') &&
				(position === run.length - 1 || token.after === ''),
		)
	)
}

/** Every answer one swap away from `tokens`. */
function singleSwaps(
	tokens: readonly AnswerToken[],
	pairs: readonly Pair[],
): AnswerToken[][] {
	const results: AnswerToken[][] = []
	tokens.forEach((token, index) => {
		const head = tokens.slice(0, index)
		for (const { short, long, contracts } of pairs) {
			if (sameWord(token.word, short)) {
				const expanded = long.map((word, position) => ({
					word: position === 0 ? matchCase(word, token.word) : word,
					before: position === 0 ? token.before : '',
					after: position === long.length - 1 ? token.after : '',
				}))
				results.push([...head, ...expanded, ...tokens.slice(index + 1)])
			}
			const run = tokens.slice(index, index + long.length)
			if (contracts && isLongForm(run, long)) {
				const contracted = {
					word: matchCase(short, token.word),
					before: token.before,
					after: run.at(-1)?.after ?? '',
				}
				results.push([
					...head,
					contracted,
					...tokens.slice(index + long.length),
				])
			}
		}
	})
	return results
}

/**
 * Every way to write an answer with its unambiguous contractions swapped
 * ("doesn't" ↔ "does not", "They're not" → "They are not" → "They aren't").
 * Breadth-first, so the original comes first and the cap drops the most
 * rewritten variants, never the closest ones.
 */
export function contractionVariants(
	tokens: readonly AnswerToken[],
): AnswerToken[][] {
	const isQuestion = tokens.at(-1)?.after.includes('?') ?? false
	const pairs = isQuestion ? ALWAYS : [...ALWAYS, ...OUTSIDE_QUESTIONS]

	const variants: AnswerToken[][] = [[...tokens]]
	const seen = new Set([answerWords(tokens).join(' ')])
	for (
		let index = 0;
		index < variants.length && variants.length < MAX_CONTRACTION_VARIANTS;
		index++
	) {
		for (const swapped of singleSwaps(variants[index] ?? [], pairs)) {
			const key = answerWords(swapped).join(' ')
			if (seen.has(key)) continue
			seen.add(key)
			variants.push(swapped)
			if (variants.length >= MAX_CONTRACTION_VARIANTS) break
		}
	}
	return variants
}
