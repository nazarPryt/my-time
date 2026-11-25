import { cn } from '@/shared/lib/cn'

export function LogoMark({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 60 48"
			aria-hidden="true"
			className={cn('h-[1.3em] w-auto shrink-0', className)}
		>
			<g fill="none" strokeLinecap="round">
				<g className="text-sidebar-primary" stroke="currentColor">
					<circle
						cx="36"
						cy="24"
						r="18"
						strokeWidth="4"
						strokeDasharray="84.82 28.27"
						transform="rotate(225 36 24)"
					/>
					<path d="M7 17.5h8M2 24h11M7 30.5h8" strokeWidth="4" />
				</g>
				<path
					d="M36 24V11M36 24l8 5.5"
					stroke="currentColor"
					strokeWidth="3.5"
				/>
			</g>
			<circle cx="36" cy="24" r="3.5" className="fill-sidebar-primary" />
		</svg>
	)
}

export function Logo({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				'inline-flex items-center gap-[0.3em] font-extrabold leading-none whitespace-nowrap',
				className,
			)}
			style={{ letterSpacing: '-0.045em' }}
		>
			<LogoMark />
			<span>
				my <span className="text-sidebar-primary">time</span>
			</span>
		</span>
	)
}
