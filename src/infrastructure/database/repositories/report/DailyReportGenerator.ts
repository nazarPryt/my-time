import { eq, and, gte, lte } from 'drizzle-orm'
import type { DailyReport } from '@/shared/schemas'
import { DailyReportSchema } from '@/shared/schemas'
import { db } from '../../connection'
import { sessions } from '../../schemas'
import { startOfDay, endOfDay, getHours } from 'date-fns'

/**
 * Daily Report Generator
 * Calculates daily statistics from raw session data
 */
export class DailyReportGenerator {
  /**
   * Calculate daily report from sessions
   */
  async generate(userId: string, date: Date): Promise<DailyReport> {
    const start = startOfDay(date)
    const end = endOfDay(date)

    // Get all sessions for the day
    const daySessions = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.userId, userId), gte(sessions.startedAt, start), lte(sessions.startedAt, end)))

    // Separate work and break sessions
    const workSessions = daySessions.filter(s => s.sessionType === 'work')
    const breakSessions = daySessions.filter(s => s.sessionType !== 'work')

    // Calculate time metrics
    const totalWorkTime = workSessions
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + s.actualDuration, 0)

    const totalBreakTime = breakSessions
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + s.actualDuration, 0)

    // Calculate session counts
    const completedPomodoros = workSessions.filter(s => s.status === 'completed').length
    const abandonedPomodoros = workSessions.filter(s => s.status === 'abandoned' || s.status === 'interrupted').length
    const totalSessions = daySessions.length

    // Calculate performance metrics
    const focusScore = this.calculateFocusScore(completedPomodoros, abandonedPomodoros)
    const completionRate = this.calculateCompletionRate(daySessions)
    const longestStreak = this.calculateLongestStreak(workSessions)

    // Calculate session statistics
    const sessionStats = this.calculateSessionStats(daySessions)

    // Calculate distributions
    const { sessionDistribution, hourlyWorkTime, peakProductivityHour } = this.calculateDistributions(daySessions)

    // Calculate tags
    const tags = this.calculateTagCounts(daySessions)

    return DailyReportSchema.parse({
      date,
      userId,
      totalWorkTime,
      totalBreakTime,
      completedPomodoros,
      abandonedPomodoros,
      totalSessions,
      focusScore,
      completionRate,
      longestStreak,
      ...sessionStats,
      peakProductivityHour,
      sessionDistribution,
      hourlyWorkTime,
      tags,
    })
  }

  private calculateFocusScore(completed: number, abandoned: number): number {
    const total = completed + abandoned
    return total > 0 ? (completed / total) * 100 : 0
  }

  private calculateCompletionRate(sessions: (typeof sessions.$inferSelect)[]): number {
    if (sessions.length === 0) return 0
    const completed = sessions.filter(s => s.status === 'completed').length
    return (completed / sessions.length) * 100
  }

  private calculateLongestStreak(workSessions: (typeof sessions.$inferSelect)[]): number {
    let longestStreak = 0
    let currentStreak = 0

    workSessions.forEach(session => {
      if (session.status === 'completed') {
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    })

    return longestStreak
  }

  private calculateSessionStats(sessions: (typeof sessions.$inferSelect)[]) {
    const completedSessions = sessions.filter(s => s.status === 'completed')
    const durations = completedSessions.map(s => s.actualDuration)

    if (durations.length === 0) {
      return {
        shortestSession: null,
        longestSession: null,
        averageSessionLength: null,
      }
    }

    return {
      shortestSession: Math.min(...durations),
      longestSession: Math.max(...durations),
      averageSessionLength: durations.reduce((sum, d) => sum + d, 0) / durations.length,
    }
  }

  private calculateDistributions(sessions: (typeof sessions.$inferSelect)[]) {
    const sessionDistribution = Array(24).fill(0)
    const hourlyWorkTime = Array(24).fill(0)

    sessions.forEach(session => {
      const hour = getHours(session.startedAt)
      sessionDistribution[hour]++

      if (session.sessionType === 'work' && session.status === 'completed') {
        hourlyWorkTime[hour] += session.actualDuration
      }
    })

    // Find peak hour (hour with most work time)
    let peakProductivityHour: number | null = null
    let maxWorkTime = 0

    hourlyWorkTime.forEach((time, hour) => {
      if (time > maxWorkTime) {
        maxWorkTime = time
        peakProductivityHour = hour
      }
    })

    // If no work was done, peak hour is null
    if (maxWorkTime === 0) {
      peakProductivityHour = null
    }

    return { sessionDistribution, hourlyWorkTime, peakProductivityHour }
  }

  private calculateTagCounts(sessions: (typeof sessions.$inferSelect)[]): Record<string, number> {
    const tagCounts: Record<string, number> = {}

    sessions.forEach(session => {
      session.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    return tagCounts
  }
}
