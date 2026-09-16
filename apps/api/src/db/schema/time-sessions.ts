import { sql } from 'drizzle-orm'
import {
	index,
	pgEnum,
	pgTable,
	timestamp,
	uniqueIndex,
	uuid,
} from 'drizzle-orm/pg-core'
import { users } from './users'

export const sessionTypeEnum = pgEnum('session_type', ['work'])

export const timeSessions = pgTable(
	'time_sessions',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: sessionTypeEnum('type').notNull().default('work'),
		startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
		endedAt: timestamp('ended_at', { withTimezone: true }),
		abandonedAt: timestamp('abandoned_at', { withTimezone: true }),
	},
	(table) => [
		index('idx_time_sessions_user_id').on(table.userId),
		index('idx_time_sessions_user_started').on(table.userId, table.startedAt),
		// At most one open (not ended, not abandoned) session per user — enforced
		// at the DB level so startSession's check-then-create can't race into
		// duplicate open sessions under concurrent/retried requests.
		uniqueIndex('idx_time_sessions_one_active_per_user')
			.on(table.userId)
			.where(sql`${table.endedAt} is null and ${table.abandonedAt} is null`),
	],
)
