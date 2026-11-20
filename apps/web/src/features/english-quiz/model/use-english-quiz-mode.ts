import type { QuizMode } from '@my-time/micro-frontends'
import { getRouteApi } from '@tanstack/react-router'
import { useCallback } from 'react'

// Typed route access without importing the route file (FSD, code-splitting).
const englishQuizRoute = getRouteApi('/dashboard/english-quiz')

/** Mode lives in the URL, so it can be bookmarked and Back works. */
export function useEnglishQuizMode() {
	const { mode } = englishQuizRoute.useSearch()
	const navigate = englishQuizRoute.useNavigate()

	const openMode = useCallback(
		(next: QuizMode | null) => {
			void navigate({ search: next ? { mode: next } : {} })
		},
		[navigate],
	)

	return { mode, openMode }
}
