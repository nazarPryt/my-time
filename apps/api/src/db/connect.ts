import { logger } from '@shared/logger'
import { sql } from 'drizzle-orm'
import { db } from '.'

export async function connectToDatabase() {
	logger.info('connecting to database')
	try {
		await db.execute(sql`select 1`)
		logger.info('database connection established')
	} catch (error) {
		if (error instanceof Error) {
			const message =
				(error.cause instanceof Error ? error.cause.message : null) ??
				error.message

			if (message.includes('ECONNREFUSED')) {
				logger.fatal(
					'database is not running or unreachable at the configured host/port',
				)
			} else if (message.includes('password authentication failed')) {
				logger.fatal(
					'invalid database credentials — check DATABASE_URL in your .env file',
				)
			} else if (
				message.includes('database') &&
				message.includes('does not exist')
			) {
				logger.fatal(
					'database does not exist — run migrations or check the database name in DATABASE_URL',
				)
			} else {
				logger.fatal({ err: error }, 'unexpected error connecting to database')
			}
		} else {
			logger.fatal({ err: error }, 'failed to connect to the database')
		}

		process.exit(1)
	}
}

const HEALTH_TIMEOUT_MS = 2000

/** Liveness of the DB for /health; a hung query counts as down. */
export async function checkDatabaseHealth(): Promise<boolean> {
	let timer: ReturnType<typeof setTimeout> | undefined
	try {
		await Promise.race([
			db.execute(sql`select 1`),
			new Promise((_, reject) => {
				timer = setTimeout(
					() => reject(new Error('database health check timed out')),
					HEALTH_TIMEOUT_MS,
				)
			}),
		])
		return true
	} catch (error) {
		logger.error({ err: error }, 'health check failed')
		return false
	} finally {
		clearTimeout(timer)
	}
}
