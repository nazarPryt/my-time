import { Skeleton, SkeletonStatus } from '@/shared/ui/skeleton'
import { SITE_BLOCKING_TEST_IDS as SB } from '../../test-ids'

const ROWS = ['w-32', 'w-24', 'w-40'] as const

/** Placeholder rows matching `BlockedSiteItem`: favicon, domain, date, remove. */
export function SiteListSkeleton() {
	return (
		<SkeletonStatus label="Loading blocked sites…" data-testid={SB.listLoading}>
			<ul className="divide-y divide-border">
				{ROWS.map((width) => (
					<li
						key={width}
						className="flex items-center justify-between px-4 py-3"
					>
						<div className="flex items-center gap-3">
							<Skeleton className="size-5 rounded-sm shrink-0" />
							<div className="space-y-2">
								<Skeleton className={`h-3.5 ${width}`} />
								<Skeleton className="h-3 w-24" />
							</div>
						</div>
						<Skeleton className="size-5 rounded-sm mr-2.5" />
					</li>
				))}
			</ul>
		</SkeletonStatus>
	)
}
