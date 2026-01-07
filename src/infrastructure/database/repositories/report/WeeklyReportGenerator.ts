import { eq, and, gte, lte } from 'drizzle-orm'
import type { WeeklyReport, DailyReport } from '@/shared/schemas'
import { WeeklyReportSchema } from '@/shared/schemas'
import { db } from '../../connection'
import { sessions } from '../../schemas'
import { startOfWeek, endOfWeek, eachDayOfInterval, addDays } from 'date-fns'
import { DailyReportGenerator } from './DailyReportGenerator'

/**
 * Weekly Report Generator
 * Aggregates daily reports into weekly statistics
 */
export class WeeklyReportGenerator {
  constructor(private dailyGenerator: DailyReportGenerator) {}

  /**
   * Generate weekly report from daily reports
   */
  async generate(userId: string, date: Date): Promise<WeeklyReport> {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }) // Monday
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 })

    // Get daily reports for each day of the week
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
    const dailyBreakdown = await Promise.all(days.map(day => this.dailyGenerator.generate(userId, day)))

    // Calculate weekly totals
    const totalWorkTime = dailyBreakdown.reduce((sum, day) => sum + day.totalWorkTime, 0)
    const totalBreakTime = dailyBreakdown.reduce((sum, day) => sum + day.totalBreakTime, 0)
    const totalPomodoros = dailyBreakdown.reduce((sum, day) => sum + day.completedPomodoros, 0)

    // Calculate averages and activity
    const activeDays = dailyBreakdown.filter(day => day.totalSessions > 0).length
    const averageDailyWorkTime = activeDays > 0 ? totalWorkTime / activeDays : 0
    const averageDailyPomodoros = activeDays > 0 ? totalPomodoros / activeDays : 0

    // Find most/least productive days
    const { mostProductiveDay, leastProductiveDay } = this.findProductiveDays(dailyBreakdown)

    // Calculate consistency
    const workTimes = dailyBreakdown.map(d => d.totalWorkTime).filter(t => t > 0)
    const consistencyScore = this.calculateConsistencyScore(workTimes)

    // Calculate weekly focus score
    const weeklyFocusScore = dailyBreakdown.reduce((sum, day) => sum + day.focusScore, 0) / 7

    // Find longest daily streak
    const longestDailyStreak = Math.max(...dailyBreakdown.map(d => d.longestStreak))

    // Calculate week-over-week change
    const weekOverWeekChange = await this.calculateWeekOverWeekChange(userId, weekStart, weekEnd, totalWorkTime)

    return WeeklyReportSchema.parse({
      weekStart,
      weekEnd,
      userId,
      dailyBreakdown,
      totalWorkTime,
      totalBreakTime,
      totalPomodoros,
      averageDailyWorkTime,
      averageDailyPomodoros,
      mostProductiveDay,
      leastProductiveDay,
      consistencyScore,
      weeklyFocusScore,
      activeDays,
      longestDailyStreak,
      weekOverWeekChange,
      weeklyGoalProgress: null, // TODO: Calculate based on weekly goal
    })
  }

  private findProductiveDays(dailyBreakdown: DailyReport[]) {
    const sortedDays = [...dailyBreakdown].sort((a, b) => b.totalWorkTime - a.totalWorkTime)

    return {
      mostProductiveDay: sortedDays[0]?.totalWorkTime > 0 ? sortedDays[0].date : null,
      leastProductiveDay:
        sortedDays[sortedDays.length - 1]?.totalWorkTime > 0 ? sortedDays[sortedDays.length - 1].date : null,
    }
  }

  private calculateConsistencyScore(workTimes: number[]): number {
    if (workTimes.length < 2) return 100

    const mean = workTimes.reduce((sum, t) => sum + t, 0) / workTimes.length
    const variance = workTimes.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / workTimes.length
    const stdDev = Math.sqrt(variance)
    const coefficientOfVariation = mean > 0 ? stdDev / mean : 0

    // Convert to 0-100 scale (lower CV = higher consistency)
    return Math.max(0, Math.min(100, 100 - coefficientOfVariation * 100))
  }

  private async calculateWeekOverWeekChange(
    userId: string,
    weekStart: Date,
    weekEnd: Date,
    currentWeekWorkTime: number,
  ): Promise<number> {
    const previousWeekStart = addDays(weekStart, -7)
    const previousWeekEnd = addDays(weekEnd, -7)

    const previousWeekSessions = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.userId, userId),
          gte(sessions.startedAt, previousWeekStart),
          lte(sessions.startedAt, previousWeekEnd),
          eq(sessions.status, 'completed'),
          eq(sessions.sessionType, 'work'),
        ),
      )

    const previousWeekWorkTime = previousWeekSessions.reduce((sum, s) => sum + s.actualDuration, 0)

    if (previousWeekWorkTime === 0) return 0

    return ((currentWeekWorkTime - previousWeekWorkTime) / previousWeekWorkTime) * 100
  }
}
