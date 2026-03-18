import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { Dumbbell, Home, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui'
import { useLogout } from '@/feature/auth/logout'
import { api } from '@/shared/lib/api'
import { cn } from '@/shared/lib/cn'
import { tokenStorage } from '@/shared/lib/token-storage'

export const Route = createFileRoute('/dashboard')({
	beforeLoad: async () => {
		const { error } = await api.auth.me.get()
		if (error) {
			tokenStorage.clear()
			throw redirect({ to: '/auth/login' })
		}
	},
	component: DashboardLayout,
})

const NAV_ITEMS = [
	{ to: '/dashboard' as const, label: 'Home', icon: Home, exact: true },
	{
		to: '/dashboard/workout' as const,
		label: 'Workout',
		icon: Dumbbell,
		exact: false,
	},
	{
		to: '/dashboard/settings' as const,
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

function SignOutButton() {
	const { logout } = useLogout()

	return (
		<Button
			onClick={logout}
			type={'button'}
			className={cn(
				'w-full flex items-center gap-2.5 px-3 py-2 rounded-md',
				'text-sm text-sidebar-foreground/55 transition-colors duration-150',
				'hover:text-sidebar-foreground hover:bg-sidebar-accent',
			)}
		>
			<LogOut size={15} strokeWidth={1.75} className="shrink-0" />
			Sign out
		</Button>
	)
}
