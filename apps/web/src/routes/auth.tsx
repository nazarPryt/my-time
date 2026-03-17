import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { tokenStorage } from '@/shared/lib/token-storage'

export const Route = createFileRoute('/auth')({
	beforeLoad: () => {
		if (tokenStorage.getAccessToken()) {
			throw redirect({ to: '/dashboard' })
		}
	},
	component: () => <Outlet />,
})
