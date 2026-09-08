import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core'
import { users } from './users'

export const permessoCheckTriggerEnum = pgEnum('permesso_check_trigger', [
	'manual',
	'scheduled',
])

export const permessoSubscriptions = pgTable('permesso_subscriptions', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.unique()
		.references(() => users.id, { onDelete: 'cascade' }),
	practiceNumber: text('practice_number').notNull(),
	// Hours of day (0-23, server local time) the automatic checker runs for this
	// user — user-configurable from the Permesso Status page, no global schedule.
	checkHours: integer('check_hours').array().notNull().default([9, 18]),
	// Set once the user completes the /start deep-link flow with the bot.
	telegramChatId: text('telegram_chat_id'),
	// One-shot token embedded in the deep link while a link is pending; cleared
	// once the bot's /start handler consumes it. Unique so a stray retry can't
	// collide with another user's in-flight link.
	telegramLinkToken: text('telegram_link_token').unique(),
	lastStatus: text('last_status'),
	lastError: text('last_error'),
	lastCheckedAt: timestamp('last_checked_at'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const permessoChecks = pgTable('permesso_checks', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	success: boolean('success').notNull(),
	status: text('status'),
	error: text('error'),
	triggeredBy: permessoCheckTriggerEnum('triggered_by')
		.notNull()
		.default('manual'),
	checkedAt: timestamp('checked_at').notNull().defaultNow(),
})
