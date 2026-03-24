import { useNavigate } from '@tanstack/react-router'
import { api } from '@/shared/lib/api'
import { tokenStorage } from '@/shared/lib/token-storage'

export function useLogout() {
	const navigate = useNavigate()

	async function logout() {
		await api.auth.logout.post({})
		tokenStorage.clear()
		await navigate({ to: '/auth/login' })
	}

	return { logout }
}
