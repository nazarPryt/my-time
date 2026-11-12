import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

/**
 * A single shimmering placeholder block. Size and shape it with Tailwind
 * classes to mirror the element it stands in for (e.g. `h-4 w-24`,
 * `size-10 rounded-full`). It is decorative — wrap a group of them in
 * `SkeletonStatus` so screen readers announce one "Loading…" instead.
 */
function Skeleton({ className, ...props }: ComponentProps<'div'>) {
	return (
		<div
			data-slot="skeleton"
			aria-hidden="true"
			className={cn('skeleton rounded-md', className)}
			{...props}
		/>
	)
}

/**
 * Accessible container for a skeleton layout: announces `label` to assistive
 * tech, marks the region busy, and fades in after a short delay so fast
 * responses never flash a skeleton.
 */
function SkeletonStatus({
	label = 'Loading…',
	className,
	children,
	...props
}: ComponentProps<'output'> & { label?: string }) {
	return (
		<output
			data-slot="skeleton-status"
			aria-busy="true"
			className={cn('skeleton-fade-in block', className)}
			{...props}
		>
			<span className="sr-only">{label}</span>
			{children}
		</output>
	)
}

export { Skeleton, SkeletonStatus }
