import { Skeleton, SkeletonStatus } from '@/shared/ui/skeleton'
import { TIME_TRACKER_TEST_IDS } from '../test-ids'

const STAT_LABEL_WIDTHS = ['w-10', 'w-14', 'w-12'] as const
const SESSION_ROWS = ['w-14', 'w-12', 'w-16'] as const

/** Mirrors the loaded widget: timer card, today's stats and the session list. */
export function TimeTrackerSkeleton() {
	return (
		<SkeletonStatus
			label="Loading time tracker…"
			data-testid={TIME_TRACKER_TEST_IDS.loading}
			className="space-y-4"
		>
			<div className="rounded-xl border border-border bg-card p-4 sm:p-8 flex flex-col items-center gap-6">
				<Skeleton className="h-5 w-16 rounded-full" />
				<div className="relative size-[200px]">
					{/* Ring track: a thick round skeleton with the card punched out of it */}
					<Skeleton className="absolute inset-[14px] rounded-full" />
					<div className="absolute inset-[20px] rounded-full bg-card" />
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
						<Skeleton className="h-8 w-32" />
						<Skeleton className="h-2.5 w-12" />
					</div>
				</div>
				<Skeleton className="h-10 w-36 rounded-md" />
			</div>

			<div className="grid grid-cols-3 gap-3">
				{STAT_LABEL_WIDTHS.map((width) => (
					<div
						key={width}
						className="rounded-xl border border-border bg-card px-4 py-3.5 space-y-2.5"
					>
						<Skeleton className={`h-2.5 ${width}`} />
						<Skeleton className="h-6 w-14" />
					</div>
				))}
			</div>

			<div className="rounded-xl border border-border bg-card overflow-hidden">
				<div className="px-5 py-3.5 border-b border-border">
					<Skeleton className="h-2.5 w-28" />
				</div>
				<div className="divide-y divide-border">
					{SESSION_ROWS.map((width) => (
						<div
							key={width}
							className="flex items-center justify-between px-5 py-3.5"
						>
							<Skeleton className="h-4 w-12" />
							<Skeleton className={`h-4 ${width}`} />
						</div>
					))}
				</div>
			</div>
		</SkeletonStatus>
	)
}
