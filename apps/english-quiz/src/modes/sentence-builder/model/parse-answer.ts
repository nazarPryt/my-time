export interface ParsedAnswer {
	/** Words the learner picks, in order, without the final punctuation. */
	words: readonly string[]
	/** Final punctuation ("?", ".", "!") shown once the sentence is complete. */
	ending: string
}

const ENDING = /[.?!]+$/

/** Splits "How do you play?" into ["How", "do", "you", "play"] + "?". */
export function parseAnswer(answer: string): ParsedAnswer {
	const words = answer.trim().split(/\s+/).filter(Boolean)
	const last = words.at(-1) ?? ''
	const ending = last.match(ENDING)?.[0] ?? ''
	if (ending) {
		const bare = last.slice(0, -ending.length)
		if (bare) words[words.length - 1] = bare
		else words.pop()
	}
	return { words, ending }
}
