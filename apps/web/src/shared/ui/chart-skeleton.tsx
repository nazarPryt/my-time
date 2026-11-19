import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
import { Skeleton, SkeletonStatus } from './skeleton'

// A gentle, deterministic wave so the placeholder reads as "a bar chart"
// without pretending to be real data (and without hydration-style jitter).
const BAR_HEIGHTS = [
	38, 52, 30, 64, 46, 72, 40, 28, 58, 80, 44, 62, 34, 50, 70, 42, 56, 36, 66,
	48, 30, 60, 76, 44, 54, 38, 68, 50, 32, 84,
]

/**
 * Placeholder for the dashboard's Recharts bar charts. Fills its parent's
 * height; the y-axis gutter matches the real charts so nothing shifts when
 * data arrives.
 */
export function ChartSkeleton({
	bars = BAR_HEIGHTS.length,
	label = 'Loading chart…',
	className,
	...props
}: ComponentProps<'output'> & { bars?: number; label?: string }) {
	return (
		<SkeletonStatus
			label={label}
			className={cn('h-full flex gap-2', className)}
			{...props}
		>
			<div className="w-5 flex flex-col justify-between py-1 shrink-0">
				<Skeleton className="h-2 w-4" />
				<Skeleton className="h-2 w-4" />
				<Skeleton className="h-2 w-3" />
			</div>
			<div className="flex-1 min-w-0 flex flex-col">
				<div className="flex-1 flex items-end gap-[3px] sm:gap-1 border-b border-dashed border-border">
					{BAR_HEIGHTS.slice(0, bars).map((height, index) => (
						<Skeleton
							key={index}
							className="flex-1 rounded-b-none rounded-t-[3px]"
							style={{ height: `${height}%` }}
						/>
					))}
				</div>
				<div className="flex justify-between pt-2">
					<Skeleton className="h-2 w-3" />
					<Skeleton className="h-2 w-4" />
					<Skeleton className="h-2 w-4" />
					<Skeleton className="h-2 w-4" />
					<Skeleton className="h-2 w-3" />
				</div>
			</div>
		</SkeletonStatus>
	)
}
