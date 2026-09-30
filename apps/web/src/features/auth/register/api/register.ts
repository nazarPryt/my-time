import type { RegisterRequest } from 'contracts'
import { api } from '@/shared/lib/api'

export async function registerUser(data: RegisterRequest) {
	return api.auth.register.post(data)
}
