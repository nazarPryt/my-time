import { index, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'

export const desktopPresence = pgTable(
	'desktop_presence',
	{
		id: uuid('id').primaryKey(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		expiresAt: timestamp('expires_at').notNull(),
	},
	(table) => [
		index('desktop_presence_user_expiry_idx').on(table.userId, table.expiresAt),
		index('desktop_presence_expiry_idx').on(table.expiresAt),
	],
)
