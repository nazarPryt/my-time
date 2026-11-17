/** One word the learner picks, plus the punctuation printed around it. */
export interface AnswerToken {
	word: string
	/** Punctuation printed before the word, e.g. an opening quote. */
	before: string
	/** Punctuation printed after the word, e.g. "," or "?". */
	after: string
}

// Apostrophes and hyphens stay inside words: "doesn't", "twenty-one".
const LEADING = /^[«"“‘(]+/
const TRAILING = /[.,;:!?…»"”’)]+$/
const PUNCTUATION_ONLY = /^[^\p{L}\p{N}]+$/u
// Dots that belong to the word, not to the sentence.
const ABBREVIATIONS = new Set([
	'mr.',
	'mrs.',
	'ms.',
	'dr.',
	'st.',
	'a.m.',
	'p.m.',
	'etc.',
])

function splitAbbreviation(raw: string): { word: string; after: string } {
	const lower = raw.toLowerCase()
	for (const abbreviation of ABBREVIATIONS) {
		if (lower.startsWith(abbreviation)) {
			const length = abbreviation.length
			return { word: raw.slice(0, length), after: raw.slice(length) }
		}
	}
	const after = raw.match(TRAILING)?.[0] ?? ''
	return { word: raw.slice(0, raw.length - after.length), after }
}

/**
 * Splits "Yes, I do." into the words the learner picks ("Yes", "I", "do")
 * and the punctuation around them, which is shown but never picked or checked.
 */
export function parseAnswer(answer: string): AnswerToken[] {
	const tokens: AnswerToken[] = []
	let pendingBefore = ''

	for (const raw of answer.trim().split(/\s+/).filter(Boolean)) {
		const last = tokens.at(-1)
		if (PUNCTUATION_ONLY.test(raw)) {
			// A detached mark ("Stop !", "— yes"): glue it to a neighbour.
			if (last && !LEADING.test(raw)) last.after += raw
			else pendingBefore += raw
			continue
		}
		const before = raw.match(LEADING)?.[0] ?? ''
		const { word, after } = splitAbbreviation(raw.slice(before.length))
		tokens.push({ word, before: pendingBefore + before, after })
		pendingBefore = ''
	}
	return tokens
}

export function answerWords(tokens: readonly AnswerToken[]): string[] {
	return tokens.map((token) => token.word)
}

/** Joins tokens back into a sentence: "Yes", ",", "I", "do", "." → "Yes, I do." */
export function formatAnswer(tokens: readonly AnswerToken[]): string {
	return tokens
		.map(({ before, word, after }) => `${before}${word}${after}`)
		.join(' ')
}
