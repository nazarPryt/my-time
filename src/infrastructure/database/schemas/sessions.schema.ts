import { pgTable, uuid, varchar, integer, timestamp, text, pgEnum } from 'drizzle-orm/pg-core'

/**
 * PostgreSQL Enums
 */
export const sessionTypeEnum = pgEnum('session_type', ['work', 'short_break', 'long_break'])
export const sessionStatusEnum = pgEnum('session_status', ['completed', 'abandoned', 'interrupted'])

/**
 * Sessions Table
 * Stores all Pomodoro sessions and breaks
 */
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  sessionType: sessionTypeEnum('session_type').notNull(),
  status: sessionStatusEnum('status').notNull(),
  plannedDuration: integer('planned_duration').notNull(),
  actualDuration: integer('actual_duration').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  pausedDuration: integer('paused_duration').notNull().default(0),
  tags: text('tags').array().notNull().default([]),
  notes: text('notes'),
  pomodoroCount: integer('pomodoro_count').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type SessionRow = typeof sessions.$inferSelect
export type NewSessionRow = typeof sessions.$inferInsert
