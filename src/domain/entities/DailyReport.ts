import type { DailyReport as DailyReportType } from '@/shared/schemas'

/**
 * DailyReport Entity
 * Represents aggregated statistics for a single day
 * Contains business logic for report analysis
 */
export class DailyReport {
  constructor(private readonly data: DailyReportType) {}

  get date(): Date {
    return this.data.date
  }

  get userId(): string {
    return this.data.userId
  }

  get totalWorkTime(): number {
    return this.data.totalWorkTime
  }

  get totalBreakTime(): number {
    return this.data.totalBreakTime
  }

  get completedPomodoros(): number {
    return this.data.completedPomodoros
  }

  get abandonedPomodoros(): number {
    return this.data.abandonedPomodoros
  }

  get totalSessions(): number {
    return this.data.totalSessions
  }

  get focusScore(): number {
    return this.data.focusScore
  }

  get completionRate(): number {
    return this.data.completionRate
  }

  get longestStreak(): number {
    return this.data.longestStreak
  }

  get shortestSession(): number | null {
    return this.data.shortestSession
  }

  get longestSession(): number | null {
    return this.data.longestSession
  }

  get averageSessionLength(): number | null {
    return this.data.averageSessionLength
  }

  get peakProductivityHour(): number | null {
    return this.data.peakProductivityHour
  }

  get sessionDistribution(): number[] {
    return this.data.sessionDistribution
  }

  get hourlyWorkTime(): number[] {
    return this.data.hourlyWorkTime
  }

  get tags(): Record<string, number> {
    return this.data.tags
  }

  /**
   * Get the raw data representation
   */
  toObject(): DailyReportType {
    return { ...this.data }
  }

  /**
   * Format total work time in human-readable format (e.g., "4h 15m")
   */
  getFormattedWorkTime(): string {
    const hours = Math.floor(this.data.totalWorkTime / 3600)
    const minutes = Math.floor((this.data.totalWorkTime % 3600) / 60)

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }
    return `${minutes}m`
  }

  /**
   * Format total break time in human-readable format
   */
  getFormattedBreakTime(): string {
    const hours = Math.floor(this.data.totalBreakTime / 3600)
    const minutes = Math.floor((this.data.totalBreakTime % 3600) / 60)

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }
    return `${minutes}m`
  }

  /**
   * Check if daily goal was met
   */
  isGoalMet(dailyGoal: number): boolean {
    return this.data.completedPomodoros >= dailyGoal
  }

  /**
   * Calculate goal progress percentage
   */
  getGoalProgress(dailyGoal: number): number {
    if (dailyGoal === 0) return 0
    return Math.min(100, (this.data.completedPomodoros / dailyGoal) * 100)
  }

  /**
   * Get the most used tag
   */
  getMostUsedTag(): string | null {
    const entries = Object.entries(this.data.tags)
    if (entries.length === 0) return null

    return entries.reduce((max, current) => (current[1] > max[1] ? current : max))[0]
  }

  /**
   * Get total active time (work + break)
   */
  getTotalActiveTime(): number {
    return this.data.totalWorkTime + this.data.totalBreakTime
  }

  /**
   * Calculate break adherence (percentage of breaks taken vs expected)
   * Ideally should be close to 100%
   */
  getBreakAdherence(): number {
    if (this.data.completedPomodoros === 0) return 0
    // Assuming one break per pomodoro (simplified)
    const expectedBreaks = this.data.completedPomodoros
    const breaksTaken = this.data.totalBreakTime > 0 ? 1 : 0 // Simplified
    return Math.min(100, (breaksTaken / expectedBreaks) * 100)
  }

  /**
   * Check if the day was productive (completed at least one pomodoro)
   */
  wasProductiveDay(): boolean {
    return this.data.completedPomodoros > 0
  }

  /**
   * Get focus quality assessment based on focus score
   */
  getFocusQuality(): 'excellent' | 'good' | 'fair' | 'poor' {
    if (this.data.focusScore >= 90) return 'excellent'
    if (this.data.focusScore >= 75) return 'good'
    if (this.data.focusScore >= 50) return 'fair'
    return 'poor'
  }

  /**
   * Get productivity level based on completed pomodoros
   */
  getProductivityLevel(dailyGoal: number): 'high' | 'medium' | 'low' {
    const progress = this.getGoalProgress(dailyGoal)
    if (progress >= 100) return 'high'
    if (progress >= 50) return 'medium'
    return 'low'
  }

  /**
   * Get the hour with most productivity
   */
  getPeakProductivityHourFormatted(): string | null {
    if (this.data.peakProductivityHour === null) return null
    const hour = this.data.peakProductivityHour
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}${ampm}`
  }

  /**
   * Generate insights based on the report data
   */
  generateInsights(dailyGoal: number): string[] {
    const insights: string[] = []

    // Goal achievement
    if (this.isGoalMet(dailyGoal)) {
      insights.push(`🎉 Great job! You completed your daily goal of ${dailyGoal} pomodoros!`)
    } else if (this.data.completedPomodoros > 0) {
      const remaining = dailyGoal - this.data.completedPomodoros
      insights.push(`You completed ${this.data.completedPomodoros} pomodoros. ${remaining} more to reach your goal!`)
    }

    // Focus score
    const focusQuality = this.getFocusQuality()
    if (focusQuality === 'excellent') {
      insights.push(`💎 Excellent focus! Your completion rate is ${Math.round(this.data.focusScore)}%.`)
    } else if (focusQuality === 'poor' && this.data.abandonedPomodoros > 0) {
      insights.push(
        `Consider reviewing what's causing distractions. ${this.data.abandonedPomodoros} sessions were abandoned.`,
      )
    }

    // Streak
    if (this.data.longestStreak >= 3) {
      insights.push(`🔥 Impressive streak! You completed ${this.data.longestStreak} pomodoros in a row.`)
    }

    // Peak productivity
    if (this.data.peakProductivityHour !== null) {
      insights.push(`Your peak productivity hour was ${this.getPeakProductivityHourFormatted()}.`)
    }

    return insights
  }

  /**
   * Factory method to create an empty daily report
   */
  static createEmpty(userId: string, date: Date): DailyReport {
    return new DailyReport({
      date,
      userId,
      totalWorkTime: 0,
      totalBreakTime: 0,
      completedPomodoros: 0,
      abandonedPomodoros: 0,
      totalSessions: 0,
      focusScore: 0,
      completionRate: 0,
      longestStreak: 0,
      shortestSession: null,
      longestSession: null,
      averageSessionLength: null,
      peakProductivityHour: null,
      sessionDistribution: Array(24).fill(0),
      hourlyWorkTime: Array(24).fill(0),
      tags: {},
    })
  }
}
