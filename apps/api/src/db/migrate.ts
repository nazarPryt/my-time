import { API_CONFIG } from '@shared/api-config'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import * as schema from './schema'

const MIGRATIONS_LOCK_ID = 7_364_182_945

export async function runMigrations() {
	console.log('📦 Running database migrations...')
	const migrationClient = postgres(API_CONFIG.DATABASE_URL, {
		max: 1,
		onnotice: () => {},
	})
	const migrationDb = drizzle(migrationClient, { schema })
	try {
		await migrationDb.execute(
			sql`select pg_advisory_lock(${MIGRATIONS_LOCK_ID})`,
		)
		await migrate(migrationDb, {
			migrationsFolder: `${import.meta.dir}/migrations`,
		})
	} finally {
		await migrationDb.execute(
			sql`select pg_advisory_unlock(${MIGRATIONS_LOCK_ID})`,
		)
		await migrationClient.end()
	}
	console.log('✅ Migrations complete.')
}
