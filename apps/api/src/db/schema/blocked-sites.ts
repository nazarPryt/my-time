import {
	index,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from 'drizzle-orm/pg-core'
import { users } from './users'

export const blockedSites = pgTable(
	'blocked_sites',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		domain: text('domain').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
	},
	(table) => [
		index('idx_blocked_sites_user_id').on(table.userId),
		unique('uq_blocked_sites_user_domain').on(table.userId, table.domain),
	],
)
