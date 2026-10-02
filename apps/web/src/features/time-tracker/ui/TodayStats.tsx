import { formatDuration } from '../lib/format-duration'
import { useTimeTrackerStore } from '../model/store'
import { TIME_TRACKER_TEST_IDS } from '../testIds'

function StatCard({
	label,
	value,
	testId,
}: {
	label: string
	value: string
	testId: string
}) {
	return (
		<div className="rounded-xl border border-border bg-card px-4 py-3.5">
			<div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">
				{label}
			</div>
			<div
				className="text-xl font-semibold text-foreground tabular-nums"
				data-testid={testId}
			>
				{value}
			</div>
		</div>
	)
}

export function TodayStats() {
	const todaySummary = useTimeTrackerStore((s) => s.todaySummary)

	if (!todaySummary) return null

	return (
		<div
			className="grid grid-cols-3 gap-3"
			data-testid={TIME_TRACKER_TEST_IDS.todayStats}
		>
			<StatCard
				label="Today"
				value={formatDuration(todaySummary.totalWorkSeconds) || '0m'}
				testId={TIME_TRACKER_TEST_IDS.statToday}
			/>
			<StatCard
				label="Sessions"
				value={String(todaySummary.sessionsCompleted)}
				testId={TIME_TRACKER_TEST_IDS.statSessions}
			/>
			<StatCard
				label="Longest"
				value={
					todaySummary.longestSessionSeconds > 0
						? formatDuration(todaySummary.longestSessionSeconds)
						: '—'
				}
				testId={TIME_TRACKER_TEST_IDS.statLongest}
			/>
		</div>
	)
}
