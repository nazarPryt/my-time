import { eq, and, gte, lte } from 'drizzle-orm'
import type { MonthlyReport } from '@/shared/schemas'
import { MonthlyReportSchema } from '@/shared/schemas'
import { db } from '../../connection'
import { sessions } from '../../schemas'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getWeek, getDayOfWeek, getHours, addDays } from 'date-fns'

/**
 * Monthly Report Generator
 * Aggregates session data into monthly statistics
 */
export class MonthlyReportGenerator {
  /**
   * Generate monthly report from session data
   */
  async generate(userId: string, date: Date): Promise<MonthlyReport> {
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)

    // Get all sessions for the month
    const monthSessions = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.userId, userId), gte(sessions.startedAt, monthStart), lte(sessions.startedAt, monthEnd)))
      .orderBy(sessions.startedAt)

    // Calculate weekly breakdown
    const weeklyBreakdown = this.calculateWeeklyBreakdown(monthSessions)

    // Calculate monthly totals
    const { totalWorkTime, totalPomodoros } = this.calculateMonthlyTotals(monthSessions)

    // Calculate activity metrics
    const { activeDays, totalActiveDays } = this.calculateActivityMetrics(monthSessions, monthStart, monthEnd)
    const averageDailyWorkTime = activeDays > 0 ? totalWorkTime / activeDays : 0

    // Find most productive week
    const mostProductiveWeek = this.findMostProductiveWeek(weeklyBreakdown)

    // Calculate productivity trend
    const productivityTrend = this.calculateProductivityTrend(monthSessions, totalWorkTime)

    // Calculate focus score
    const monthlyFocusScore = this.calculateFocusScore(monthSessions)

    // Calculate streaks
    const longestStreak = 0 // TODO: Implement proper streak calculation

    // Calculate month-over-month change
    const monthOverMonthChange = await this.calculateMonthOverMonthChange(userId, monthStart, totalWorkTime)

    // Generate heatmap data
    const heatmapData = this.generateHeatmapData(monthSessions)

    // Calculate distributions
    const { hourOfDayDistribution, dayOfWeekDistribution } = this.calculateDistributions(monthSessions)

    return MonthlyReportSchema.parse({
      month,
      year,
      userId,
      weeklyBreakdown,
      totalWorkTime,
      totalPomodoros,
      averageDailyWorkTime,
      mostProductiveWeek,
      productivityTrend,
      monthlyFocusScore,
      activeDays,
      totalActiveDays,
      longestStreak,
      monthOverMonthChange,
      heatmapData,
      hourOfDayDistribution,
      dayOfWeekDistribution,
      monthlyGoalProgress: null, // TODO: Calculate based on monthly goal
    })
  }

  private calculateWeeklyBreakdown(monthSessions: (typeof sessions.$inferSelect)[]) {
    const weeks = new Map<number, { totalWorkTime: number; totalPomodoros: number }>()

    monthSessions.forEach(session => {
      const weekNumber = getWeek(session.startedAt)
      if (!weeks.has(weekNumber)) {
        weeks.set(weekNumber, { totalWorkTime: 0, totalPomodoros: 0 })
      }

      const week = weeks.get(weekNumber)!
      if (session.sessionType === 'work' && session.status === 'completed') {
        week.totalWorkTime += session.actualDuration
        week.totalPomodoros += 1
      }
    })

    return Array.from(weeks.entries()).map(([weekNumber, data]) => ({
      weekNumber,
      ...data,
    }))
  }

  private calculateMonthlyTotals(monthSessions: (typeof sessions.$inferSelect)[]) {
    const totalWorkTime = monthSessions
      .filter(s => s.sessionType === 'work' && s.status === 'completed')
      .reduce((sum, s) => sum + s.actualDuration, 0)

    const totalPomodoros = monthSessions.filter(s => s.sessionType === 'work' && s.status === 'completed').length

    return { totalWorkTime, totalPomodoros }
  }

  private calculateActivityMetrics(monthSessions: (typeof sessions.$inferSelect)[], monthStart: Date, monthEnd: Date) {
    const daysWithSessions = new Set(monthSessions.map(s => format(s.startedAt, 'yyyy-MM-dd')))
    const activeDays = daysWithSessions.size
    const totalActiveDays = activeDays

    return { activeDays, totalActiveDays }
  }

  private findMostProductiveWeek(
    weeklyBreakdown: { weekNumber: number; totalWorkTime: number; totalPomodoros: number }[],
  ) {
    if (weeklyBreakdown.length === 0) return null

    return weeklyBreakdown.reduce((max, week) => (week.totalWorkTime > max.totalWorkTime ? week : max)).weekNumber
  }

  private calculateProductivityTrend(monthSessions: (typeof sessions.$inferSelect)[], totalWorkTime: number) {
    const firstHalfWorkTime = monthSessions
      .filter(s => s.startedAt.getDate() <= 15 && s.sessionType === 'work' && s.status === 'completed')
      .reduce((sum, s) => sum + s.actualDuration, 0)

    const secondHalfWorkTime = monthSessions
      .filter(s => s.startedAt.getDate() > 15 && s.sessionType === 'work' && s.status === 'completed')
      .reduce((sum, s) => sum + s.actualDuration, 0)

    const threshold = totalWorkTime * 0.1

    if (Math.abs(secondHalfWorkTime - firstHalfWorkTime) < threshold) {
      return 'stable' as const
    }

    return secondHalfWorkTime > firstHalfWorkTime ? ('increasing' as const) : ('decreasing' as const)
  }

  private calculateFocusScore(monthSessions: (typeof sessions.$inferSelect)[]): number {
    const completedCount = monthSessions.filter(s => s.status === 'completed').length
    const abandonedCount = monthSessions.filter(s => s.status === 'abandoned').length

    if (completedCount + abandonedCount === 0) return 0

    return (completedCount / (completedCount + abandonedCount)) * 100
  }

  private async calculateMonthOverMonthChange(
    userId: string,
    monthStart: Date,
    currentMonthWorkTime: number,
  ): Promise<number> {
    const previousMonthStart = startOfMonth(addDays(monthStart, -1))
    const previousMonthEnd = endOfMonth(addDays(monthStart, -1))

    const previousMonthSessions = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.userId, userId),
          gte(sessions.startedAt, previousMonthStart),
          lte(sessions.startedAt, previousMonthEnd),
          eq(sessions.status, 'completed'),
          eq(sessions.sessionType, 'work'),
        ),
      )

    const previousMonthWorkTime = previousMonthSessions.reduce((sum, s) => sum + s.actualDuration, 0)

    if (previousMonthWorkTime === 0) return 0

    return ((currentMonthWorkTime - previousMonthWorkTime) / previousMonthWorkTime) * 100
  }

  private generateHeatmapData(monthSessions: (typeof sessions.$inferSelect)[]): number[][] {
    // 5 weeks x 7 days
    const heatmapData: number[][] = Array(5)
      .fill(0)
      .map(() => Array(7).fill(0))

    monthSessions.forEach(session => {
      if (session.sessionType === 'work' && session.status === 'completed') {
        const weekIndex = Math.floor((session.startedAt.getDate() - 1) / 7)
        const dayIndex = getDayOfWeek(session.startedAt)

        if (weekIndex < 5 && dayIndex < 7) {
          heatmapData[weekIndex][dayIndex] += session.actualDuration
        }
      }
    })

    return heatmapData
  }

  private calculateDistributions(monthSessions: (typeof sessions.$inferSelect)[]) {
    const hourOfDayDistribution = Array(24).fill(0)
    const dayOfWeekDistribution = Array(7).fill(0)

    monthSessions.forEach(session => {
      if (session.sessionType === 'work' && session.status === 'completed') {
        const hour = getHours(session.startedAt)
        const dayOfWeek = getDayOfWeek(session.startedAt)

        hourOfDayDistribution[hour] += session.actualDuration
        dayOfWeekDistribution[dayOfWeek] += session.actualDuration
      }
    })

    return { hourOfDayDistribution, dayOfWeekDistribution }
  }
}
