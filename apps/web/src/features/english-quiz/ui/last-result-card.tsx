import type { QuizResult } from '@my-time/mfe-contracts'
import { format, parseISO } from 'date-fns'
import { ENGLISH_QUIZ_TEST_IDS } from '../test-ids'

/**
 * Rendered by the host (React) from an event the remote (Vue) sent —
 * demonstrates remote → host communication through the contract.
 */
export function LastResultCard({ result }: { result: QuizResult | null }) {
	return (
		<div
			data-testid={ENGLISH_QUIZ_TEST_IDS.lastResult}
			className="max-w-xl mx-auto rounded-xl border border-dashed border-border px-4 py-3 text-xs text-muted-foreground flex justify-between gap-3"
		>
			<span>Last result (received by the host)</span>
			<span className="font-medium text-foreground">
				{result
					? `${result.level} · ${result.correct}/${result.total} · ${format(parseISO(result.completedAt), 'HH:mm')}`
					: '—'}
			</span>
		</div>
	)
}
