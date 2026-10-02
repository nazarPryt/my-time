import { createFileRoute, redirect } from '@tanstack/react-router'
import { tokenStorage } from '@/shared/lib/token-storage'

export const Route = createFileRoute('/')({
	beforeLoad: () => {
		throw redirect({
			to: tokenStorage.getAccessToken() ? '/dashboard' : '/auth/login',
		})
	},
})
