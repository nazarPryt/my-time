import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { DesktopPairingIdSchema } from 'contracts'
import { DashboardPending } from '@/app/ui/dashboard-pending'
import { DashboardShell } from '@/app/ui/dashboard-shell'
import { fetchMe } from '@/features/auth/shared/api'
import { tokenStorage } from '@/shared/lib/token-storage'
import { NotFoundScreen } from '@/shared/ui/not-found-screen'

export const Route = createFileRoute('/dashboard')({
	beforeLoad: async ({ location }) => {
		const { error } = await fetchMe()
		if (error) {
			tokenStorage.clear()
			const desktopRequest =
				location.pathname === '/dashboard/time-tracker'
					? DesktopPairingIdSchema.safeParse(
							new URLSearchParams(location.searchStr).get('desktopRequest'),
						).data
					: undefined
			throw redirect({ to: '/auth/login', search: { desktopRequest } })
		}
	},
	component: DashboardLayout,
	pendingComponent: DashboardPending,
	// Show the shell skeleton quickly on a cold load instead of a blank page.
	pendingMs: 200,
	pendingMinMs: 300,
	notFoundComponent: () => <NotFoundScreen />,
})

function DashboardLayout() {
	return (
		<DashboardShell>
			<Outlet />
		</DashboardShell>
	)
}
