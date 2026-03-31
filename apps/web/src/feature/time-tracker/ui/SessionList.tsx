import { useTimeTrackerStore } from '../store'
import { SessionRow } from './SessionRow'

export function SessionList() {
	const todaySummary = useTimeTrackerStore((s) => s.todaySummary)

	if (!todaySummary || todaySummary.sessions.length === 0) return null

	return (
		<div className="rounded-xl border border-border bg-card overflow-hidden">
			<div className="px-5 py-3 border-b border-border">
				<span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
					Today's Sessions
				</span>
			</div>
			<div className="divide-y divide-border">
				{todaySummary.sessions.map((session) => (
					<SessionRow key={session.id} session={session} />
				))}
			</div>
		</div>
	)
}
