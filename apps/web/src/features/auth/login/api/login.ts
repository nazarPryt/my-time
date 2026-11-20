import type { LoginRequest } from '@my-time/contracts'
import { api } from '@/shared/lib/api'

export async function loginUser(data: LoginRequest) {
	return api.auth.login.post(data)
}
