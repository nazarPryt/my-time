import {
	ENGLISH_QUIZ_TEST_IDS,
	EnglishQuizHeader,
	EnglishQuizRemote,
	LastResultCard,
	useEnglishQuizHost,
} from '@/features/english-quiz'

export function EnglishQuizPage() {
	const { remoteProps, lastResult } = useEnglishQuizHost()

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
