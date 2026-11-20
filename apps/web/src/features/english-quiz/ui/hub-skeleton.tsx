import { ENGLISH_QUIZ_MODES } from '@my-time/micro-frontends'
import { Skeleton, SkeletonStatus } from '@/shared/ui/skeleton'
import { ENGLISH_QUIZ_TEST_IDS } from '../test-ids'

function ModeCardSkeleton() {
	return (
		<div className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
			<div className="flex-1 space-y-2">
				<Skeleton className="h-4 w-28" />
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-3/4" />
				<div className="flex gap-1.5 pt-1">
					<Skeleton className="h-5 w-14 rounded-full" />
					<Skeleton className="h-5 w-14 rounded-full" />
				</div>
			</div>
			<Skeleton className="size-4 shrink-0" />
		</div>
	)
}

/** Mirrors the remote's hub: header, one category, a card per mode. */
export function HubSkeleton() {
	return (
		<SkeletonStatus data-testid={ENGLISH_QUIZ_TEST_IDS.loading}>
			<div className="space-y-6">
				<div className="space-y-1.5">
					<Skeleton className="h-5 w-40" />
					<Skeleton className="h-4 w-72 max-w-full" />
				</div>
				<div className="space-y-3">
					<Skeleton className="h-3 w-28" />
					<div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
						{ENGLISH_QUIZ_MODES.map((mode) => (
							<ModeCardSkeleton key={mode} />
						))}
					</div>
				</div>
			</div>
		</SkeletonStatus>
	)
}
