import type { IReportRepository } from '@domain/interfaces'
import type { WeeklyReport } from '@shared/schemas'

export interface GetWeeklyReportInput {
  userId: string
  weekStartDate: Date // Should be a Monday (start of week)
}

export interface GetWeeklyReportOutput {
  report: WeeklyReport
}

/**
 * Use Case: Get Weekly Report
 *
 * Retrieves the weekly report for a specific user and week.
 * The report aggregates daily statistics across 7 days.
 */
export class GetWeeklyReportUseCase {
  constructor(private readonly reportRepository: IReportRepository) {}

  async execute(input: GetWeeklyReportInput): Promise<GetWeeklyReportOutput> {
    // Normalize the date to start of day
    const weekStart = new Date(input.weekStartDate)
    weekStart.setHours(0, 0, 0, 0)

    // Ensure it's a Monday (start of week)
    const dayOfWeek = weekStart.getDay()
    if (dayOfWeek !== 1) {
      // Adjust to previous Monday
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      weekStart.setDate(weekStart.getDate() - daysToSubtract)
    }

    // Get the weekly report from repository
    const report = await this.reportRepository.getWeeklyReport(input.userId, weekStart)

    return { report }
  }
}
