import { db } from '@db'
import { refreshTokens, users } from '@db/schema'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

export async function runMigrations() {
	await migrate(db, {
		migrationsFolder: `${import.meta.dir}/../db/migrations`,
	})
}

export async function cleanDatabase() {
	// Order matters: FK constraint (refresh_tokens.user_id → users.id)
	await db.delete(refreshTokens)
	await db.delete(users)
}
