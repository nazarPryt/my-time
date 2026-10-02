import type { PermessoCheckHistoryResponse } from 'contracts'
import { CheckHistory } from './check-history'

type Props = {
	history: PermessoCheckHistoryResponse
	loading: boolean
}

export function HistorySection({ history, loading }: Props) {
	return (
		<div className="rounded-xl border border-border bg-card overflow-hidden">
			<div className="px-4 py-3 border-b border-border">
				<h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
					History
				</h2>
			</div>
			<CheckHistory history={history} loading={loading} />
		</div>
	)
}
