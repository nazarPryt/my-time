import { api } from '@/shared/lib/api'

export async function logoutUser() {
	return api.auth.logout.post({})
}
