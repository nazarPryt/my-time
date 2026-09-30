import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { DashboardShell } from '@/app/ui/dashboard-shell'
import { fetchMe } from '@/features/auth/shared/api'
import { tokenStorage } from '@/shared/lib/token-storage'
import { NotFoundScreen } from '@/shared/ui/not-found-screen'

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

function DashboardLayout() {
	return (
		<DashboardShell>
			<Outlet />
		</DashboardShell>
	)
}
