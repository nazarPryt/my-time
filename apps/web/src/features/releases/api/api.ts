import { api } from '@/shared/lib/api'

export async function fetchSeenRelease() {
	return api.releases.seen.get()
}

export async function markReleaseSeen(version: string) {
	return api.releases.seen.put({ version })
}
