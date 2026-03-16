import { sql } from 'drizzle-orm'
import { db } from '.'

export async function connectToDatabase() {
	console.log('🔌 Connecting to database...')
	try {
		await db.execute(sql`select 1`)
		console.log('✅ Database connection established.')
	} catch (error) {
		console.error('❌ Failed to connect to the database.')

		if (error instanceof Error) {
			const message =
				(error.cause instanceof Error ? error.cause.message : null) ??
				error.message

			if (message.includes('ECONNREFUSED')) {
				console.error(
					'🚫 Database is not running or unreachable at the configured host/port.',
				)
			} else if (message.includes('password authentication failed')) {
				console.error(
					'🔑 Invalid database credentials. Check DATABASE_URL in your .env file.',
				)
			} else if (
				message.includes('database') &&
				message.includes('does not exist')
			) {
				console.error(
					'🗄️  Database does not exist. Run migrations or check the database name in DATABASE_URL.',
				)
			} else {
				console.error(`⚠️  Unexpected error: ${message}`)
			}
		}

		process.exit(1)
	}
}
