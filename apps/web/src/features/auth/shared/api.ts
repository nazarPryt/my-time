import { api } from '@/shared/lib/api'

export async function fetchMe() {
	return api.auth.me.get()
}
