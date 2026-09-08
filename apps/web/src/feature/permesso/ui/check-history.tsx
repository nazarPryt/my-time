import type { PermessoCheckHistoryResponse } from 'contracts'
import { format } from 'date-fns'
import { CheckCircle2, History, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type Props = {
	history: PermessoCheckHistoryResponse
	loading: boolean
}

export function CheckHistory({ history, loading }: Props) {
	if (loading) {
		return (
			<div className="flex items-center justify-center h-24">
				<span className="text-xs text-muted-foreground">Loading…</span>
			</div>
		)
	}

	if (history.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-2 h-24 text-center px-6">
				<History size={20} className="text-muted-foreground/40" />
				<span className="text-xs text-muted-foreground">No checks yet</span>
			</div>
		)
	}

	return (
		<ul className="divide-y divide-border">
			{history.map((entry) => (
				<li key={entry.id} className="flex items-center gap-3 px-4 py-3">
					{entry.success ? (
						<CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
					) : (
						<XCircle size={15} className="text-destructive shrink-0" />
					)}
					<div className="flex-1 min-w-0">
						<p className="text-sm text-foreground truncate">
							{entry.success ? entry.status : entry.error}
						</p>
						<p className="text-xs text-muted-foreground">
							{format(new Date(entry.checkedAt), 'PPp')}
						</p>
					</div>
					<Badge
						variant={entry.triggeredBy === 'scheduled' ? 'warning' : 'info'}
						className="shrink-0"
					>
						{entry.triggeredBy === 'scheduled' ? 'Scheduled' : 'Manual'}
					</Badge>
				</li>
			))}
		</ul>
	)
}
