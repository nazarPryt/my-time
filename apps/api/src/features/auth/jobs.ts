import { Cron } from 'croner'
import { refreshTokenRepository } from './repository'

async function purgeExpiredRefreshTokens() {
	await refreshTokenRepository.deleteExpired()
}

// Weekly cleanup every Sunday at 03:00
export function scheduleAuthJobs() {
	new Cron('0 3 * * 0', purgeExpiredRefreshTokens)
}
