import { isQuizMode, type QuizMode } from '@my-time/mfe-contracts'

export interface EnglishQuizSearch {
	mode?: QuizMode
}

export const ENGLISH_QUIZ_MODE_PARAM = 'mode' satisfies keyof EnglishQuizSearch

/**
 * Unknown modes fall back to the hub. Always returns the key: TanStack merges
 * raw params into validated ones, so a missing key lets the raw value through.
 */
export function validateEnglishQuizSearch(
	search: Record<string, unknown>,
): EnglishQuizSearch {
	const mode = search[ENGLISH_QUIZ_MODE_PARAM]
	return { [ENGLISH_QUIZ_MODE_PARAM]: isQuizMode(mode) ? mode : undefined }
}
