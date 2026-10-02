import type { SessionResponse } from 'contracts'
import { differenceInSeconds, format } from 'date-fns'
import { Badge } from '@/shared/ui/badge'
import { formatDuration } from '../lib/format-duration'
import { TIME_TRACKER_TEST_IDS } from '../testIds'

export function SessionRow({ session }: { session: SessionResponse }) {
	const abandoned = session.abandonedAt !== null
	const endedAt = session.endedAt
	const completed = endedAt !== null && !abandoned
	const durSec = completed
		? differenceInSeconds(endedAt, session.startedAt)
		: null

	return (
		<div
			className="flex items-center justify-between px-5 py-3"
			data-testid={TIME_TRACKER_TEST_IDS.sessionRow}
		>
			<span
				className="text-sm text-foreground font-mono tabular-nums"
				data-testid={TIME_TRACKER_TEST_IDS.sessionTime}
			>
				{format(session.startedAt, 'HH:mm')}
			</span>
			<div className="flex items-center gap-2">
				{abandoned && (
					<span
						className="text-xs text-muted-foreground"
						data-testid={TIME_TRACKER_TEST_IDS.sessionAbandoned}
					>
						abandoned
					</span>
				)}
				{!completed && !abandoned && (
					<Badge
						variant="secondary"
						className="text-[10px] h-5 px-1.5"
						data-testid={TIME_TRACKER_TEST_IDS.sessionActiveBadge}
					>
						Active
					</Badge>
				)}
				{durSec !== null && (
					<span
						className="text-sm text-muted-foreground font-mono tabular-nums"
						data-testid={TIME_TRACKER_TEST_IDS.sessionDuration}
					>
						{formatDuration(durSec)}
					</span>
				)}
			</div>
		</div>
	)
}
