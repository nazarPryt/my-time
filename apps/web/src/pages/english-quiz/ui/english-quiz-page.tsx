import type { EnglishQuizEvent, QuizResult } from '@my-time/mfe-contracts'
import { useCallback, useMemo, useState } from 'react'
import {
	ENGLISH_QUIZ_TEST_IDS,
	EnglishQuizHeader,
	EnglishQuizRemote,
	LastResultCard,
} from '@/features/english-quiz'

export function EnglishQuizPage() {
	const [lastResult, setLastResult] = useState<QuizResult | null>(null)

	const handleEvent = useCallback((event: EnglishQuizEvent) => {
		if (event.type === 'quiz-completed') setLastResult(event.result)
	}, [])

	// Stable props object so the remote is updated only when something changes.
	const remoteProps = useMemo(
		() => ({ initialLevel: 'B1' as const, onEvent: handleEvent }),
		[handleEvent],
	)

	return (
		<div
			data-testid={ENGLISH_QUIZ_TEST_IDS.page}
			className="h-full flex flex-col"
		>
			<EnglishQuizHeader />
			<div className="flex-1 overflow-auto p-4 sm:p-8 space-y-4">
				<LastResultCard result={lastResult} />
				<EnglishQuizRemote {...remoteProps} />
			</div>
		</div>
	)
}
