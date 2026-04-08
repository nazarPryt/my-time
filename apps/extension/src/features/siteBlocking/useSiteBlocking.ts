// Feature hook — site blocking state for the popup UI.
// Communicates with the background service worker for sync (so DNR rules are
// updated in the right context). Reads cached counts from storage directly.
// Calls BLL only; never imports from dal/ or chrome APIs directly.

import { useCallback, useEffect, useState } from 'react'
import { getCachedBlockedSites } from '@/bll/siteBlocking/siteBlockingService'
import type { ExtensionMessage, ExtensionResponse } from '@/shared/messages'

export interface UseSiteBlockingReturn {
	blockedCount: number | null
	syncing: boolean
	sync: () => Promise<void>
}

export function useSiteBlocking(active: boolean): UseSiteBlockingReturn {
	const [blockedCount, setBlockedCount] = useState<number | null>(null)
	const [syncing, setSyncing] = useState(false)

	// Load the cached count whenever the dashboard becomes visible
	useEffect(() => {
		if (!active) return
		getCachedBlockedSites().then((sites) => setBlockedCount(sites.length))
	}, [active])

	const sync = useCallback(async () => {
		setSyncing(true)
		const message: ExtensionMessage = { type: 'SYNC' }
		const response = (await browser.runtime.sendMessage(message)) as Extract<
			ExtensionResponse,
			{ type: 'SYNC' }
		>
		setBlockedCount(response?.count ?? 0)
		setSyncing(false)
	}, [])

	return { blockedCount, syncing, sync }
}
