/** Progress through the sentences of one topic. */
export type SentenceOutcome = 'first-try' | 'after-mistakes'

export interface PracticeState {
	readonly total: number
	/** One entry per finished sentence, in order. */
	readonly outcomes: readonly SentenceOutcome[]
}

export type ProgressDot = SentenceOutcome | 'current' | 'upcoming'

export function startPractice(total: number): PracticeState {
	return { total, outcomes: [] }
}

export function currentIndex(state: PracticeState): number {
	return state.outcomes.length
}

export function isFinished(state: PracticeState): boolean {
	return state.outcomes.length >= state.total
}

export function completeSentence(
	state: PracticeState,
	firstTry: boolean,
): PracticeState {
	if (isFinished(state)) return state
	return {
		...state,
		outcomes: [...state.outcomes, firstTry ? 'first-try' : 'after-mistakes'],
	}
}

/** Sentences solved without a single mistake. */
export function score(state: PracticeState): number {
	return state.outcomes.filter((outcome) => outcome === 'first-try').length
}

export function progressDots(state: PracticeState): ProgressDot[] {
	return Array.from({ length: state.total }, (_, index) => {
		const outcome = state.outcomes[index]
		if (outcome) return outcome
		return index === currentIndex(state) ? 'current' : 'upcoming'
	})
}
