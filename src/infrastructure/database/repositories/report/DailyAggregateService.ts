import { eq, and, gte, lte } from 'drizzle-orm'
import type { DailyReport } from '@/shared/schemas'
import { db } from '../../connection'
import { dailyAggregates, type NewDailyAggregateRow } from '../../schemas'
import { format, eachDayOfInterval } from 'date-fns'

/**
 * Daily Aggregate Service
 * Handles caching of daily reports in the database
 */
export class DailyAggregateService {
  /**
   * Get cached daily aggregate if it exists
   */
  async getCached(userId: string, date: Date): Promise<typeof dailyAggregates.$inferSelect | null> {
    const dateStr = format(date, 'yyyy-MM-dd')

    const [aggregate] = await db
      .select()
      .from(dailyAggregates)
      .where(and(eq(dailyAggregates.userId, userId), eq(dailyAggregates.date, dateStr)))
      .limit(1)

    return aggregate || null
  }

  /**
   * Save daily report as aggregate
   */
  async save(report: DailyReport): Promise<void> {
    const dateStr = format(report.date, 'yyyy-MM-dd')

    // Delete existing aggregate if it exists
    await db
      .delete(dailyAggregates)
      .where(and(eq(dailyAggregates.userId, report.userId), eq(dailyAggregates.date, dateStr)))

    // Insert new aggregate
    const newAggregate: NewDailyAggregateRow = {
      userId: report.userId,
      date: dateStr,
      totalWorkTime: report.totalWorkTime,
      totalBreakTime: report.totalBreakTime,
      completedPomodoros: report.completedPomodoros,
      abandonedPomodoros: report.abandonedPomodoros,
      totalSessions: report.totalSessions,
      focusScore: report.focusScore.toString(),
      longestStreak: report.longestStreak,
      peakHour: report.peakProductivityHour,
    }

    await db.insert(dailyAggregates).values(newAggregate)
  }

  /**
   * Invalidate cached aggregate for a specific date
   */
  async invalidate(userId: string, date?: Date): Promise<void> {
    if (date) {
      const dateStr = format(date, 'yyyy-MM-dd')
      await db.delete(dailyAggregates).where(and(eq(dailyAggregates.userId, userId), eq(dailyAggregates.date, dateStr)))
    } else {
      // Invalidate all aggregates for user
      await db.delete(dailyAggregates).where(eq(dailyAggregates.userId, userId))
    }
  }

  /**
   * Get cached aggregates for a date range
   */
  async getCachedRange(userId: string, startDate: Date, endDate: Date) {
    const startStr = format(startDate, 'yyyy-MM-dd')
    const endStr = format(endDate, 'yyyy-MM-dd')

    return db
      .select()
      .from(dailyAggregates)
      .where(
        and(eq(dailyAggregates.userId, userId), gte(dailyAggregates.date, startStr), lte(dailyAggregates.date, endStr)),
      )
  }

  /**
   * Check if all days in a range have cached aggregates
   */
  async isRangeCached(userId: string, startDate: Date, endDate: Date): Promise<boolean> {
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const cached = await this.getCachedRange(userId, startDate, endDate)

    return cached.length === days.length
  }
}
