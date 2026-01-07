import type { IReportRepository } from '@domain/interfaces'
import type { DailyReport } from '@shared/schemas'

export interface GetDailyReportInput {
  userId: string
  date: Date
}

export interface GetDailyReportOutput {
  report: DailyReport
}

/**
 * Use Case: Get Daily Report
 *
 * Retrieves the daily report for a specific user and date.
 * The report includes aggregated statistics for all sessions on that day.
 */
export class GetDailyReportUseCase {
  constructor(private readonly reportRepository: IReportRepository) {}

  async execute(input: GetDailyReportInput): Promise<GetDailyReportOutput> {
    // Normalize the date to start of day
    const date = new Date(input.date)
    date.setHours(0, 0, 0, 0)

    // Get the daily report from repository
    // The repository will either return cached aggregate or generate it
    const report = await this.reportRepository.getDailyReport(input.userId, date)

    return { report }
  }
}
