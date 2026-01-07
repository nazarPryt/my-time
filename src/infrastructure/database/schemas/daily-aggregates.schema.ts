import { pgTable, uuid, date, integer, decimal, timestamp } from 'drizzle-orm/pg-core'

/**
 * Daily Aggregates Table
 * Pre-computed daily statistics for fast report generation
 */
export const dailyAggregates = pgTable('daily_aggregates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  date: date('date').notNull(),
  totalWorkTime: integer('total_work_time').notNull(),
  totalBreakTime: integer('total_break_time').notNull(),
  completedPomodoros: integer('completed_pomodoros').notNull(),
  abandonedPomodoros: integer('abandoned_pomodoros').notNull(),
  totalSessions: integer('total_sessions').notNull(),
  focusScore: decimal('focus_score', { precision: 5, scale: 2 }).notNull(),
  longestStreak: integer('longest_streak').notNull(),
  peakHour: integer('peak_hour'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type DailyAggregateRow = typeof dailyAggregates.$inferSelect
export type NewDailyAggregateRow = typeof dailyAggregates.$inferInsert
