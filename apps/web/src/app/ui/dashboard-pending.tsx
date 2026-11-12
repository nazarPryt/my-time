import { Skeleton, SkeletonStatus } from '@/shared/ui/skeleton'
import { Wordmark } from './dashboard-shell'

const NAV_WIDTHS = ['w-12', 'w-16', 'w-24', 'w-24', 'w-28', 'w-16'] as const

/**
 * Shown by the dashboard route while it verifies the session (`/auth/me`)
 * and that check is slow. Mirrors `DashboardShell` so the real layout
 * replaces it without a jump.
 */
export function DashboardPending() {
	return (
		<SkeletonStatus
			label="Loading dashboard…"
			className="flex flex-col md:flex-row h-screen bg-background overflow-hidden"
		>
			<header className="flex md:hidden items-center gap-3 h-14 px-4 border-b border-sidebar-border bg-sidebar shrink-0">
				<Skeleton className="size-6" />
				<Wordmark />
			</header>

			<aside className="hidden md:flex w-55 shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
				<div className="h-14 flex items-center px-5 border-b border-sidebar-border shrink-0">
					<Wordmark />
				</div>
				<div className="flex-1 p-2 pt-3 space-y-0.5">
					{NAV_WIDTHS.map((width, index) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: static decorative rows never reorder
							key={index}
							className="flex items-center gap-2.5 px-3 py-2"
						>
							<Skeleton className="size-[15px] rounded-sm" />
							<Skeleton className={`h-3.5 ${width}`} />
						</div>
					))}
				</div>
				<div className="shrink-0 p-3 border-t border-sidebar-border space-y-3">
					<Skeleton className="h-2.5 w-8 ml-3" />
					<Skeleton className="h-8 w-full" />
				</div>
			</aside>

			<main className="flex-1 min-w-0 flex flex-col">
				<div className="h-14 flex items-center gap-3 px-4 sm:px-8 border-b border-border shrink-0">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-3 w-28" />
				</div>
				<div className="flex-1 p-4 sm:p-8 space-y-4">
					<div className="max-w-lg mx-auto space-y-4">
						<Skeleton className="h-48 w-full rounded-xl" />
						<div className="grid grid-cols-3 gap-3">
							<Skeleton className="h-18 rounded-xl" />
							<Skeleton className="h-18 rounded-xl" />
							<Skeleton className="h-18 rounded-xl" />
						</div>
						<Skeleton className="h-32 w-full rounded-xl" />
					</div>
				</div>
			</main>
		</SkeletonStatus>
	)
}
