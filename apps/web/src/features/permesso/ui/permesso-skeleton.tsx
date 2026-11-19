import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Skeleton, SkeletonStatus } from '@/shared/ui/skeleton'
import { PERMESSO_TEST_IDS } from '../test-ids'

const HISTORY_ROWS = ['w-4/5', 'w-3/5', 'w-2/3'] as const

/** Placeholder rows for the check history list. */
export function CheckHistorySkeleton() {
	return (
		<ul aria-hidden="true" className="divide-y divide-border">
			{HISTORY_ROWS.map((width) => (
				<li key={width} className="flex items-center gap-3 px-4 py-3">
					<Skeleton className="size-[15px] rounded-full shrink-0" />
					<div className="flex-1 min-w-0 space-y-2">
						<Skeleton className={`h-3.5 ${width}`} />
						<Skeleton className="h-3 w-28" />
					</div>
					<Skeleton className="h-5 w-16 rounded-full shrink-0" />
				</li>
			))}
		</ul>
	)
}

function CardHeaderSkeleton({
	titleWidth,
	withAction = false,
	withDescription = false,
}: {
	titleWidth: string
	withAction?: boolean
	withDescription?: boolean
}) {
	return (
		<CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
			<div className="space-y-2.5 flex-1">
				<div className="flex items-center gap-2">
					<Skeleton className="size-4 rounded-sm shrink-0" />
					<Skeleton className={`h-4 ${titleWidth}`} />
				</div>
				{withDescription && <Skeleton className="h-3.5 w-3/4" />}
			</div>
			{withAction && (
				<Skeleton className="h-10 w-full sm:h-8 sm:w-24 rounded-md shrink-0" />
			)}
		</CardHeader>
	)
}

/** Mirrors the loaded page: status, Telegram, practice number and history. */
export function PermessoSkeleton() {
	return (
		<SkeletonStatus
			label="Loading permesso status…"
			data-testid={PERMESSO_TEST_IDS.loading}
			className="space-y-4 sm:space-y-6"
		>
			<Card>
				<CardHeaderSkeleton titleWidth="w-32" withAction />
				<CardContent className="space-y-3">
					<div className="rounded-lg border border-border px-3 py-3 space-y-2">
						<Skeleton className="h-3.5 w-full" />
						<Skeleton className="h-3.5 w-4/5" />
						<Skeleton className="h-3.5 w-2/5" />
					</div>
					<Skeleton className="h-3 w-36" />
				</CardContent>
			</Card>

			<Card>
				<CardHeaderSkeleton titleWidth="w-44" withAction withDescription />
				<CardContent>
					<Skeleton className="h-5 w-20 rounded-full" />
				</CardContent>
			</Card>

			<Card>
				<CardHeaderSkeleton titleWidth="w-36" withDescription />
				<CardContent>
					<div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
						<Skeleton className="h-10 sm:h-9 flex-1" />
						<Skeleton className="h-10 sm:h-9 sm:w-16" />
					</div>
				</CardContent>
			</Card>

			<div className="rounded-xl border border-border bg-card overflow-hidden">
				<div className="px-4 py-3.5 border-b border-border">
					<Skeleton className="h-2.5 w-14" />
				</div>
				<CheckHistorySkeleton />
			</div>
		</SkeletonStatus>
	)
}
