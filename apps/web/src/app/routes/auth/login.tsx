import { createFileRoute } from '@tanstack/react-router'
import { DesktopPairingIdSchema } from 'contracts'
import { LoginPage } from '@/pages/login'

export const Route = createFileRoute('/auth/login')({
	validateSearch: (
		search: Record<string, unknown>,
	): { desktopRequest?: string } => ({
		desktopRequest: DesktopPairingIdSchema.safeParse(search.desktopRequest)
			.data,
	}),
	component: LoginPage,
})
