import { Link } from '@tanstack/react-router'
import { cn } from '@/shared/lib/cn'
import type { NavItemType } from './nav-items'

type SidebarNavLinkProps = {
	item: NavItemType
	onNavigate?: () => void
}

export function SidebarNavLink({ item, onNavigate }: SidebarNavLinkProps) {
	const { to, label, icon: Icon, exact, testId, indicator: Indicator } = item

	return (
		<Link
			to={to}
			data-testid={testId}
			activeOptions={{ exact }}
			onClick={onNavigate}
			className={cn(
				'relative flex items-center gap-3 px-4 py-3 md:gap-2.5 md:px-3 md:py-2 rounded-md',
				'text-base md:text-sm text-sidebar-foreground/55 transition-colors duration-150',
				'hover:text-sidebar-foreground hover:bg-sidebar-accent',
				'[&.active]:text-sidebar-foreground [&.active]:bg-sidebar-accent [&.active]:font-medium',
			)}
		>
			{({ isActive }: { isActive: boolean }) => (
				<>
					{/* Left accent bar */}
					<span
						aria-hidden="true"
						className={cn(
							'absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-sidebar-primary transition-opacity duration-150',
							isActive ? 'opacity-100' : 'opacity-0',
						)}
					/>
					<Icon strokeWidth={1.75} className="size-5 md:size-[15px] shrink-0" />
					{label}
					{Indicator && <Indicator />}
				</>
			)}
		</Link>
	)
}
