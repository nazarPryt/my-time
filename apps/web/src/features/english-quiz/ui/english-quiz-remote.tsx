import type { EnglishQuizProps } from '@my-time/micro-frontends'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { RemoteApp } from '@/shared/lib/micro-frontends'
import { Button } from '@/shared/ui/button'
import { loadEnglishQuiz } from '../model/load-english-quiz'
import { ENGLISH_QUIZ_TEST_IDS } from '../test-ids'
import { HubSkeleton } from './hub-skeleton'

function QuizUnavailable({ onRetry }: { onRetry: () => void }) {
	return (
		<div
			data-testid={ENGLISH_QUIZ_TEST_IDS.error}
			className="max-w-xl mx-auto rounded-xl border border-border bg-card p-6 flex flex-col items-center gap-3 text-center"
		>
			<AlertTriangle
				size={20}
				strokeWidth={1.75}
				className="text-destructive"
			/>
			<p className="text-sm font-medium text-foreground">
				The quiz is unavailable right now
			</p>
			<p className="text-xs text-muted-foreground">
				The rest of your dashboard is not affected.
			</p>
			<Button
				variant="outline"
				size="sm"
				onClick={onRetry}
				data-testid={ENGLISH_QUIZ_TEST_IDS.retry}
			>
				<RotateCcw size={12} strokeWidth={2.5} />
				Try again
			</Button>
		</div>
	)
}

/** Host-side slot for the English quiz remote (apps/english-quiz). */
export function EnglishQuizRemote(props: EnglishQuizProps) {
	return (
		<RemoteApp
			testId={ENGLISH_QUIZ_TEST_IDS.remote}
			load={loadEnglishQuiz}
			props={props}
			fallback={<HubSkeleton />}
			renderError={(_error, retry) => <QuizUnavailable onRetry={retry} />}
		/>
	)
}
