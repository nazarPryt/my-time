// DAL — site-blocking HTTP calls.

import type { BlockedSiteResponse } from 'contracts'
import { apiFetch } from './client'

export async function fetchBlockedSitesRequest(): Promise<{
	data: BlockedSiteResponse[] | null
	error: string | null
}> {
	return apiFetch<BlockedSiteResponse[]>('/site-blocking')
}
