import {
	type EnglishQuizEvent,
	isQuizMode,
	type QuizMode,
} from '@my-time/micro-frontends'

export interface ModeScore {
	correct: number
	total: number
}

export interface PracticeProgress {
	scores: Partial<Record<QuizMode, ModeScore>>
}

export const EMPTY_PROGRESS: PracticeProgress = { scores: {} }

export function withScore(
	progress: PracticeProgress,
	mode: QuizMode,
	score: ModeScore,
): PracticeProgress {
	return { ...progress, scores: { ...progress.scores, [mode]: score } }
}

export function scoreFromEvent(event: EnglishQuizEvent): ModeScore | null {
	if (event.type !== 'quiz-completed') return null
	const { correct, total } = event.result
	return { correct, total }
}

/** Drops anything invalid, including modes that no longer exist. */
export function parseProgress(value: unknown): PracticeProgress {
	if (!isRecord(value) || !isRecord(value.scores)) return EMPTY_PROGRESS
	const scores: PracticeProgress['scores'] = {}
	for (const [mode, score] of Object.entries(value.scores)) {
		if (isQuizMode(mode) && isModeScore(score)) scores[mode] = score
	}
	return { scores }
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}

function isModeScore(value: unknown): value is ModeScore {
	return (
		isRecord(value) &&
		Number.isInteger(value.correct) &&
		Number.isInteger(value.total) &&
		(value.correct as number) >= 0 &&
		(value.correct as number) <= (value.total as number)
	)
}
