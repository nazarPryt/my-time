import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'

export const extensionTokens = pgTable('extension_tokens', {
	id: uuid('id').primaryKey().defaultRandom(),
	token: uuid('token').notNull().unique().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at').notNull(),
})
