import { Skeleton, SkeletonStatus } from '@/shared/ui/skeleton'
import { WORKOUT_TEST_IDS } from '../testIds'

const QUICK_ADD_SLOTS = [5, 10, 15, 20] as const
const REST_PRESETS = ['w-9', 'w-8', 'w-9', 'w-8', 'w-8'] as const
const SET_ROWS = [0, 1, 2] as const

/** Mirrors the loaded workout page: counter, quick-add, rest timer, sets log. */
export function WorkoutSkeleton() {
	return (
		<SkeletonStatus
			label="Loading workout…"
			data-testid={WORKOUT_TEST_IDS.loading}
			className="space-y-4"
		>
			<div className="rounded-xl border border-border bg-card p-7 flex flex-col items-center gap-5">
				<Skeleton className="h-2.5 w-28" />
				<Skeleton
					className="w-28 rounded-xl"
					style={{ height: 'clamp(72px, 14vw, 104px)' }}
				/>
				<div className="w-full space-y-2.5">
					<Skeleton className="h-0.75 w-full rounded-full" />
					<div className="flex items-center justify-between">
						<Skeleton className="h-3 w-14" />
						<Skeleton className="h-3 w-8" />
					</div>
				</div>
			</div>

			<div className="grid grid-cols-4 gap-2">
				{QUICK_ADD_SLOTS.map((slot) => (
					<div
						key={slot}
						className="h-17 rounded-xl border border-border bg-card flex flex-col items-center justify-center gap-1.5"
					>
						<Skeleton className="size-2.5 rounded-full" />
						<Skeleton className="h-5 w-7" />
					</div>
				))}
			</div>

			<div className="rounded-xl border border-border bg-card p-5">
				<Skeleton className="h-2.5 w-20" />
				<div className="mt-3 flex gap-1.5 justify-center flex-wrap">
					{REST_PRESETS.map((width, index) => (
						<Skeleton
							// biome-ignore lint/suspicious/noArrayIndexKey: static decorative chips never reorder
							key={index}
							className={`h-6.5 ${width} rounded-lg`}
						/>
					))}
				</div>
			</div>

			<div className="rounded-xl border border-border bg-card overflow-hidden">
				<div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
					<Skeleton className="h-2.5 w-16" />
					<Skeleton className="h-3 w-16" />
				</div>
				<div className="divide-y divide-border">
					{SET_ROWS.map((row) => (
						<div
							key={row}
							className="flex items-center justify-between px-5 py-3"
						>
							<Skeleton className="h-3 w-10" />
							<div className="flex items-center gap-3">
								<Skeleton className="h-4 w-8" />
								<Skeleton className="size-3 rounded-sm" />
							</div>
						</div>
					))}
				</div>
			</div>
		</SkeletonStatus>
	)
}
