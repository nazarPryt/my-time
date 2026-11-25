import { scheduleJob } from '@shared/jobs'
import { refreshTokenRepository } from './repository'

export const PURGE_REFRESH_TOKENS_JOB = 'auth.purge-expired-refresh-tokens'

// Weekly cleanup every Sunday at 03:00
export function scheduleAuthJobs() {
	scheduleJob(PURGE_REFRESH_TOKENS_JOB, '0 3 * * 0', async () => {
		await refreshTokenRepository.deleteExpired()
		return undefined
	})
}
