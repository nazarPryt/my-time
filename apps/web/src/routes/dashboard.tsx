import {
	createFileRoute,
	Link,
	type LinkProps,
	Outlet,
	redirect,
} from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import { Dumbbell, Home, Settings, Timer } from 'lucide-react'
import { NotFoundScreen } from '@/components/not-found-screen'
import { fetchMe } from '@/feature/auth/api'
import { SignOutButton } from '@/feature/auth/logout'
import { cn } from '@/shared/lib/cn'
import { tokenStorage } from '@/shared/lib/token-storage'

export const Route = createFileRoute('/dashboard')({
	beforeLoad: async () => {
		const { error } = await fetchMe()
		if (error) {
			tokenStorage.clear()
			throw redirect({ to: '/auth/login' })
		}
	},
	component: DashboardLayout,
	notFoundComponent: () => <NotFoundScreen />,
})

type NavItemType = {
	to: LinkProps['to']
	label: string
	icon: LucideIcon
	exact: boolean
}
const NAV_ITEMS: NavItemType[] = [
	{ to: '/dashboard', label: 'Home', icon: Home, exact: true },
	{
		to: '/dashboard/workout',
		label: 'Workout',
		icon: Dumbbell,
		exact: false,
	},
	{
		to: '/dashboard/time-tracker',
		label: 'Time tracker',
		icon: Timer,
		exact: false,
	},
	{
		to: '/dashboard/settings',
		label: 'Settings',
		icon: Settings,
		exact: false,
	},
] as const

function DashboardLayout() {
	return (
		<div className="flex h-screen bg-background overflow-hidden">
			<Sidebar />
			<main className="flex-1 overflow-auto min-w-0">
				<Outlet />
			</main>
		</div>
	)
}

function Sidebar() {
	return (
		<aside className="w-55 shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border">
			{/* Wordmark */}
			<div className="h-14 flex items-center px-5 border-b border-sidebar-border shrink-0">
				<span
					className="text-[17px] font-bold text-sidebar-foreground"
					style={{ letterSpacing: '-0.04em' }}
				>
					my·time
				</span>
			</div>

			{/* Navigation */}
			<nav className="flex-1 p-2 pt-3 space-y-0.5">
				{NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
					<Link
						key={to}
						to={to}
						activeOptions={{ exact }}
						className={cn(
							'relative flex items-center gap-2.5 px-3 py-2 rounded-md',
							'text-sm text-sidebar-foreground/55 transition-colors duration-150',
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
								<Icon size={15} strokeWidth={1.75} className="shrink-0" />
								{label}
							</>
						)}
					</Link>
				))}
			</nav>

			{/* Footer */}
			<div className="shrink-0 p-3 border-t border-sidebar-border space-y-1">
				<span className="block px-3 text-[10px] font-medium tracking-widest uppercase text-sidebar-foreground/25">
					v0.1
				</span>
				<SignOutButton />
			</div>
		</aside>
	)
}
