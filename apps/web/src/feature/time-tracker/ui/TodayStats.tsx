import { useTimeTrackerStore } from '../store'
import { formatDuration } from '../utils'

function StatCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl border border-border bg-card px-4 py-3.5">
			<div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">
				{label}
			</div>
			<div className="text-xl font-semibold text-foreground tabular-nums">
				{value}
			</div>
		</div>
	)
}

export function TodayStats() {
	const todaySummary = useTimeTrackerStore((s) => s.todaySummary)

	if (!todaySummary) return null

	return (
		<div className="grid grid-cols-3 gap-3">
			<StatCard
				label="Today"
				value={formatDuration(todaySummary.totalWorkSeconds) || '0m'}
			/>
			<StatCard
				label="Sessions"
				value={String(todaySummary.sessionsCompleted)}
			/>
			<StatCard
				label="Longest"
				value={
					todaySummary.longestSessionSeconds > 0
						? formatDuration(todaySummary.longestSessionSeconds)
						: '—'
				}
			/>
		</div>
	)
}
