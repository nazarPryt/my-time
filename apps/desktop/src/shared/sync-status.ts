import { format } from 'date-fns'

interface SyncStatus {
	pendingSessions: number
	syncingOffline?: boolean
}

export function syncStatusText({
	pendingSessions,
	syncingOffline,
}: SyncStatus): string {
	const sessions = `${pendingSessions} ${pendingSessions === 1 ? 'session' : 'sessions'}`
	if (syncingOffline)
		return pendingSessions > 0 ? `Syncing ${sessions}…` : 'Finishing sync…'
	return pendingSessions > 0
		? `${sessions} waiting to sync · Saved on this desktop`
		: 'No sessions waiting to sync'
}

export function lastSyncText(lastSuccessfulSyncAt: Date | null): string {
	return lastSuccessfulSyncAt
		? `Last successful sync: ${format(lastSuccessfulSyncAt, 'MMM d, HH:mm')}`
		: 'No successful sync yet'
}
