import { useNavigate } from '@tanstack/react-router'
import { api } from '@/shared/lib/api'
import { tokenStorage } from '@/shared/lib/token-storage'

export function useLogout() {
	const navigate = useNavigate()

	async function logout() {
		const refreshToken = tokenStorage.getRefreshToken()
		if (refreshToken) {
			await api.auth.logout.post({ refreshToken })
		}
		tokenStorage.clear()
		await navigate({ to: '/auth/login' })
	}

	return { logout }
}
