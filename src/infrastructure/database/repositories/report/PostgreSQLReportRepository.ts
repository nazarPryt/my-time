import type { IReportRepository } from '@/domain/interfaces'
import type { DailyReport, WeeklyReport, MonthlyReport } from '@/shared/schemas'
import { DailyReportGenerator } from './DailyReportGenerator'
import { WeeklyReportGenerator } from './WeeklyReportGenerator'
import { MonthlyReportGenerator } from './MonthlyReportGenerator'
import { DailyAggregateService } from './DailyAggregateService'
import { eachDayOfInterval } from 'date-fns'

/**
 * PostgreSQL Report Repository
 * Orchestrates report generation and caching
 */
export class PostgreSQLReportRepository implements IReportRepository {
  private dailyGenerator: DailyReportGenerator
  private weeklyGenerator: WeeklyReportGenerator
  private monthlyGenerator: MonthlyReportGenerator
  private aggregateService: DailyAggregateService

  constructor() {
    this.dailyGenerator = new DailyReportGenerator()
    this.weeklyGenerator = new WeeklyReportGenerator(this.dailyGenerator)
    this.monthlyGenerator = new MonthlyReportGenerator()
    this.aggregateService = new DailyAggregateService()
  }

  /**
   * Get or generate daily report
   */
  async getDailyReport(userId: string, date: Date): Promise<DailyReport> {
    // Try to get from cache first
    const cached = await this.aggregateService.getCached(userId, date)

    if (cached) {
      // We still generate the full report but with cached aggregate data
      // This ensures we have all the detailed metrics
      return this.dailyGenerator.generate(userId, date)
    }

    // Generate new report
    const report = await this.dailyGenerator.generate(userId, date)

    // Cache it for future use
    await this.aggregateService.save(report)

    return report
  }

  /**
   * Get or generate weekly report
   */
  async getWeeklyReport(userId: string, date: Date): Promise<WeeklyReport> {
    return this.weeklyGenerator.generate(userId, date)
  }

  /**
   * Get or generate monthly report
   */
  async getMonthlyReport(userId: string, date: Date): Promise<MonthlyReport> {
    return this.monthlyGenerator.generate(userId, date)
  }

  /**
   * Regenerate daily aggregate
   */
  async regenerateDailyAggregate(userId: string, date: Date): Promise<void> {
    const report = await this.dailyGenerator.generate(userId, date)
    await this.aggregateService.save(report)
  }

  /**
   * Invalidate cached reports
   */
  async invalidateCache(userId: string, date?: Date): Promise<void> {
    await this.aggregateService.invalidate(userId, date)
  }

  /**
   * Get daily reports for a date range
   */
  async getDailyReportsInRange(userId: string, startDate: Date, endDate: Date): Promise<DailyReport[]> {
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    return Promise.all(days.map(day => this.getDailyReport(userId, day)))
  }
}
