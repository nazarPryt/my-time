import type {
	EnglishQuizEvent,
	EnglishQuizProps,
	QuizResult,
} from '@my-time/mfe-contracts'
import { useCallback, useMemo, useState } from 'react'
import { useEnglishQuizMode } from './use-english-quiz-mode'

/** Maps the URL to remote props, and remote events to host state. */
export function useEnglishQuizHost() {
	const { mode, openMode } = useEnglishQuizMode()
	const [lastResult, setLastResult] = useState<QuizResult | null>(null)

	const onEvent = useCallback(
		(event: EnglishQuizEvent) => {
			switch (event.type) {
				case 'mode-changed':
					openMode(event.mode)
					break
				case 'quiz-completed':
					setLastResult(event.result)
					break
				case 'quiz-started':
					break
			}
		},
		[openMode],
	)

	// Stable props object so the remote is updated only when something changes.
	const remoteProps = useMemo<EnglishQuizProps>(
		() => ({ mode, onEvent }),
		[mode, onEvent],
	)

	return { remoteProps, lastResult }
}
