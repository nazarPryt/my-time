import type { SessionResponse } from 'contracts'
import { differenceInSeconds, format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { formatDuration } from '../utils'

export function SessionRow({ session }: { session: SessionResponse }) {
	const abandoned = session.abandonedAt !== null
	const endedAt = session.endedAt
	const completed = endedAt !== null && !abandoned
	const durSec = completed
		? differenceInSeconds(endedAt, session.startedAt)
		: null

	return (
		<div className="flex items-center justify-between px-5 py-3">
			<span className="text-sm text-foreground font-mono tabular-nums">
				{format(session.startedAt, 'HH:mm')}
			</span>
			<div className="flex items-center gap-2">
				{abandoned && (
					<span className="text-xs text-muted-foreground">abandoned</span>
				)}
				{!completed && !abandoned && (
					<Badge variant="secondary" className="text-[10px] h-5 px-1.5">
						Active
					</Badge>
				)}
				{durSec !== null && (
					<span className="text-sm text-muted-foreground font-mono tabular-nums">
						{formatDuration(durSec)}
					</span>
				)}
			</div>
		</div>
	)
}
