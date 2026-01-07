import type { IReportRepository } from '@domain/interfaces'
import type { MonthlyReport } from '@shared/schemas'

export interface GetMonthlyReportInput {
  userId: string
  year: number
  month: number // 1-12
}

export interface GetMonthlyReportOutput {
  report: MonthlyReport
}

/**
 * Use Case: Get Monthly Report
 *
 * Retrieves the monthly report for a specific user, year, and month.
 * The report aggregates statistics across all days in the month.
 */
export class GetMonthlyReportUseCase {
  constructor(private readonly reportRepository: IReportRepository) {}

  async execute(input: GetMonthlyReportInput): Promise<GetMonthlyReportOutput> {
    // Validate month
    if (input.month < 1 || input.month > 12) {
      throw new Error('Month must be between 1 and 12')
    }

    // Get the monthly report from repository
    const report = await this.reportRepository.getMonthlyReport(input.userId, input.year, input.month)

    return { report }
  }
}
