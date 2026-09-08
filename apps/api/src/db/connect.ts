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
