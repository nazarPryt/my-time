import { z } from 'zod'

/**
 * Daily Report Schema
 * Aggregated statistics for a single day
 */
export const DailyReportSchema = z.object({
  date: z.coerce.date(),
  userId: z.string().uuid(),
  // Time metrics (in seconds)
  totalWorkTime: z.number().int().nonnegative(),
  totalBreakTime: z.number().int().nonnegative(),
  // Session counts
  completedPomodoros: z.number().int().nonnegative(),
  abandonedPomodoros: z.number().int().nonnegative(),
  totalSessions: z.number().int().nonnegative(),
  // Performance metrics
  focusScore: z.number().min(0).max(100).describe('Completion rate: (completed / (completed + abandoned)) * 100'),
  completionRate: z.number().min(0).max(100),
  longestStreak: z.number().int().nonnegative(),
  // Session statistics
  shortestSession: z.number().int().nonnegative().nullable(),
  longestSession: z.number().int().nonnegative().nullable(),
  averageSessionLength: z.number().nonnegative().nullable(),
  // Distribution data
  peakProductivityHour: z.number().int().min(0).max(23).nullable(),
  sessionDistribution: z.array(z.number().int().nonnegative()).length(24).describe('Session counts by hour (0-23)'),
  hourlyWorkTime: z.array(z.number().int().nonnegative()).length(24).describe('Work time in seconds by hour (0-23)'),
  // Tags aggregation
  tags: z.record(z.string(), z.number().int().nonnegative()).default({}),
})

export type DailyReport = z.infer<typeof DailyReportSchema>

/**
 * Weekly Report Schema
 * Aggregated statistics for a week
 */
export const WeeklyReportSchema = z.object({
  weekStart: z.coerce.date(),
  weekEnd: z.coerce.date(),
  userId: z.string().uuid(),
  // Daily breakdown
  dailyBreakdown: z.array(DailyReportSchema).length(7),
  // Weekly totals
  totalWorkTime: z.number().int().nonnegative(),
  totalBreakTime: z.number().int().nonnegative(),
  totalPomodoros: z.number().int().nonnegative(),
  // Averages
  averageDailyWorkTime: z.number().nonnegative(),
  averageDailyPomodoros: z.number().nonnegative(),
  // Performance
  mostProductiveDay: z.coerce.date().nullable(),
  leastProductiveDay: z.coerce.date().nullable(),
  consistencyScore: z.number().min(0).max(100).describe('Inverse of coefficient of variation'),
  weeklyFocusScore: z.number().min(0).max(100),
  // Activity
  activeDays: z.number().int().min(0).max(7),
  longestDailyStreak: z.number().int().nonnegative(),
  // Comparison
  weekOverWeekChange: z.number().describe('Percentage change from previous week'),
  weeklyGoalProgress: z.number().min(0).max(100).nullable(),
})

export type WeeklyReport = z.infer<typeof WeeklyReportSchema>

/**
 * Monthly Report Schema
 * Aggregated statistics for a month
 */
export const MonthlyReportSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020),
  userId: z.string().uuid(),
  // Weekly breakdown
  weeklyBreakdown: z
    .array(
      z.object({
        weekNumber: z.number().int(),
        totalWorkTime: z.number().int().nonnegative(),
        totalPomodoros: z.number().int().nonnegative(),
      }),
    )
    .min(4)
    .max(5),
  // Monthly totals
  totalWorkTime: z.number().int().nonnegative(),
  totalPomodoros: z.number().int().nonnegative(),
  // Averages
  averageDailyWorkTime: z.number().nonnegative(),
  // Performance
  mostProductiveWeek: z.number().int().min(1).max(53).nullable(),
  productivityTrend: z.enum(['increasing', 'decreasing', 'stable']),
  monthlyFocusScore: z.number().min(0).max(100),
  // Activity
  activeDays: z.number().int().nonnegative(),
  totalActiveDays: z.number().int().nonnegative(),
  longestStreak: z.number().int().nonnegative(),
  // Comparison
  monthOverMonthChange: z.number().describe('Percentage change from previous month'),
  // Heatmap data
  heatmapData: z
    .array(z.array(z.number().int().nonnegative()))
    .describe('2D array: [week][dayOfWeek] with work time values'),
  // Distribution
  hourOfDayDistribution: z.array(z.number().int().nonnegative()).length(24).describe('Work time distribution by hour'),
  dayOfWeekDistribution: z
    .array(z.number().int().nonnegative())
    .length(7)
    .describe('Work time distribution by day of week (0=Sun, 6=Sat)'),
  // Goal
  monthlyGoalProgress: z.number().min(0).max(100).nullable(),
})

export type MonthlyReport = z.infer<typeof MonthlyReportSchema>
