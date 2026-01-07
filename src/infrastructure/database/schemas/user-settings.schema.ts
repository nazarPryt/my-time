import { pgTable, uuid, integer, boolean, text, timestamp } from 'drizzle-orm/pg-core'

/**
 * User Settings Table
 * User preferences and configuration
 */
export const userSettings = pgTable('user_settings', {
  userId: uuid('user_id').primaryKey(),
  workDuration: integer('work_duration').notNull().default(1500), // 25 minutes
  shortBreakDuration: integer('short_break_duration').notNull().default(300), // 5 minutes
  longBreakDuration: integer('long_break_duration').notNull().default(900), // 15 minutes
  longBreakInterval: integer('long_break_interval').notNull().default(4),
  autoStartBreaks: boolean('auto_start_breaks').notNull().default(false),
  autoStartPomodoros: boolean('auto_start_pomodoros').notNull().default(false),
  notificationEnabled: boolean('notification_enabled').notNull().default(true),
  notificationSound: text('notification_sound').notNull().default('default'),
  dailyGoalPomodoros: integer('daily_goal_pomodoros').notNull().default(8),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type UserSettingsRow = typeof userSettings.$inferSelect
export type NewUserSettingsRow = typeof userSettings.$inferInsert
