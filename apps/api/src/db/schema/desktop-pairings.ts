import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'

export const desktopPairings = pgTable(
	'desktop_pairings',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		secretHash: text('secret_hash').notNull(),
		requestKey: text('request_key').notNull(),
		confirmationCode: text('confirmation_code').notNull(),
		userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		nextPollAt: timestamp('next_poll_at').notNull(),
	},
	(table) => [index('desktop_pairings_request_key_idx').on(table.requestKey)],
)
