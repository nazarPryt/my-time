import { authMacro } from '@shared/auth-macro'
import {
	SyncOfflineSessionsRequestSchema,
	TIME_TRACKER_ROUTES,
} from 'contracts'
import { Elysia } from 'elysia'
import { OfflineSyncError, syncOfflineSessions } from './offline-sync'
import { timeTrackerService } from './service'

export const offlineSessionsPlugin = new Elysia().use(authMacro).post(
	TIME_TRACKER_ROUTES.syncOffline,
	async ({ userId, body, status }) => {
		try {
			await syncOfflineSessions(userId, body)
			return timeTrackerService.getTimer(userId)
		} catch (error) {
			if (error instanceof OfflineSyncError)
				return status('Conflict', error.message)
			throw error
		}
	},
	{ auth: true, body: SyncOfflineSessionsRequestSchema },
)
