import type { AnswerToken } from './parse-answer'

/**
 * [short, long] pairs that mean the same in any sentence. The long form is
 * never contracted at the end of a clause ("Yes, I am." ≠ "Yes, I'm.").
 */
const PRONOUN_CONTRACTIONS: readonly (readonly [string, string])[] = [
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
]

/**
 * Only expanded: "I've got" → "I have got", but "I have a car" must not
 * become "I've a car" ('ve contracts only the auxiliary).
 */
const EXPAND_ONLY: readonly (readonly [string, string])[] = [
	["I've", 'I have'],
	["you've", 'you have'],
	["we've", 'we have'],
	["they've", 'they have'],
]

/**
 * Not expanded in questions: "Why don't you…?" cannot become
 * "Why do not you…?". Ambiguous forms ('s = is/has, 'd = had/would) are
 * deliberately missing; list those as `accept` patterns instead.
 */
const NEGATIVE_CONTRACTIONS: readonly (readonly [string, string])[] = [
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
const MAX_CONTRACTION_VARIANTS = 16

interface Pair {
	short: string
	long: readonly string[]
	/** When the long form may be contracted. */
	contract: 'never' | 'mid-clause' | 'always'
}

function toPairs(
	list: readonly (readonly [string, string])[],
	contract: Pair['contract'],
): Pair[] {
	return list.map(([short, long]) => ({
		short,
		long: long.split(' '),
		contract,
	}))
}

const ALWAYS = [
	...toPairs(PRONOUN_CONTRACTIONS, 'mid-clause'),
	...toPairs(EXPAND_ONLY, 'never'),
]
const OUTSIDE_QUESTIONS = toPairs(NEGATIVE_CONTRACTIONS, 'always')

/** Keeps a capital at the start of the sentence: "Don't" ↔ "Do not". */
function matchCase(word: string, like: string): string {
	const upper = like.charAt(0) !== like.charAt(0).toLowerCase()
	return upper ? word.charAt(0).toUpperCase() + word.slice(1) : word
}

function sameWord(a: string, b: string): boolean {
	return a.toLowerCase() === b.toLowerCase()
}

/** The ways to write the tokens starting at `index`, and how many they span. */
function optionsAt(
	tokens: readonly AnswerToken[],
	index: number,
	pairs: readonly Pair[],
): { options: AnswerToken[][]; span: number } {
	const token = tokens[index] as AnswerToken
	for (const { short, long, contract } of pairs) {
		if (sameWord(token.word, short)) {
			const expanded = long.map((word, position) => ({
				word: position === 0 ? matchCase(word, token.word) : word,
				before: position === 0 ? token.before : '',
				after: position === long.length - 1 ? token.after : '',
			}))
			return { options: [[token], expanded], span: 1 }
		}
		if (contract === 'never') continue
		const run = tokens.slice(index, index + long.length)
		const last = run.at(-1)
		const endsClause =
			index + long.length >= tokens.length || (last?.after ?? '') !== ''
		if (
			run.length === long.length &&
			run.every((part, position) =>
				sameWord(part.word, long[position] ?? ''),
			) &&
			!(contract === 'mid-clause' && endsClause)
		) {
			const contracted = {
				word: matchCase(short, token.word),
				before: token.before,
				after: last?.after ?? '',
			}
			return { options: [run, [contracted]], span: long.length }
		}
	}
	return { options: [[token]], span: 1 }
}

/**
 * Every way to write an answer with its unambiguous contractions swapped
 * ("doesn't" ↔ "does not", "I'm" ↔ "I am"). The original comes first.
 */
export function contractionVariants(
	tokens: readonly AnswerToken[],
): AnswerToken[][] {
	const isQuestion = tokens.at(-1)?.after.includes('?') ?? false
	const pairs = isQuestion ? ALWAYS : [...ALWAYS, ...OUTSIDE_QUESTIONS]

	let variants: AnswerToken[][] = [[]]
	for (let index = 0; index < tokens.length; ) {
		const { options, span } = optionsAt(tokens, index, pairs)
		variants = variants
			.flatMap((variant) => options.map((option) => [...variant, ...option]))
			.slice(0, MAX_CONTRACTION_VARIANTS)
		index += span
	}
	return variants
}
