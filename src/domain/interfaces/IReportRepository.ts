import type { DailyReport, WeeklyReport, MonthlyReport } from '@/shared/schemas'

/**
 * Report Repository Interface
 * Defines the contract for report generation and retrieval
 * Handles aggregation and caching of session data
 */
export interface IReportRepository {
  /**
   * Get or generate a daily report for a specific date
   * @param userId - The user ID
   * @param date - The date to generate the report for
   * @returns Daily report with aggregated statistics
   */
  getDailyReport(userId: string, date: Date): Promise<DailyReport>

  /**
   * Get or generate a weekly report for the week containing the given date
   * @param userId - The user ID
   * @param date - Any date within the week
   * @returns Weekly report with aggregated statistics
   */
  getWeeklyReport(userId: string, date: Date): Promise<WeeklyReport>

  /**
   * Get or generate a monthly report for the month containing the given date
   * @param userId - The user ID
   * @param date - Any date within the month
   * @returns Monthly report with aggregated statistics
   */
  getMonthlyReport(userId: string, date: Date): Promise<MonthlyReport>

  /**
   * Regenerate daily aggregate for a specific date
   * Forces recalculation and updates cached data
   * @param userId - The user ID
   * @param date - The date to regenerate
   */
  regenerateDailyAggregate(userId: string, date: Date): Promise<void>

  /**
   * Invalidate cached reports for a user
   * @param userId - The user ID
   * @param date - Optional specific date to invalidate (if not provided, invalidates all)
   */
  invalidateCache(userId: string, date?: Date): Promise<void>

  /**
   * Get daily reports for a date range
   * @param userId - The user ID
   * @param startDate - Start of the date range
   * @param endDate - End of the date range
   * @returns Array of daily reports
   */
  getDailyReportsInRange(userId: string, startDate: Date, endDate: Date): Promise<DailyReport[]>
}
