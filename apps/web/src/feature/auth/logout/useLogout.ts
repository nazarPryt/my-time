import { useNavigate } from '@tanstack/react-router'
import { tokenStorage } from '@/shared/lib/token-storage'
import { logoutUser } from './api'

export function useLogout() {
	const navigate = useNavigate()

	async function logout() {
		await logoutUser()
		tokenStorage.clear()
		await navigate({ to: '/auth/login' })
	}

	return { logout }
}
