/**
 * Dependency Injection Container
 *
 * This file serves as the composition root where all dependencies are wired together.
 * It follows the Dependency Inversion Principle by creating concrete implementations
 * and injecting them into use cases.
 */

import { db } from '@infra/database/connection'
import {
  PostgreSQLSessionRepository,
  PostgreSQLSettingsRepository,
  DailyReportGenerator,
  WeeklyReportGenerator,
  MonthlyReportGenerator,
  DailyAggregateService,
} from '@infra/database/repositories'

// Use cases
import {
  StartWorkUseCase,
  StartShortBreakUseCase,
  StartLongBreakUseCase,
  PauseTimerUseCase,
  ResumeTimerUseCase,
  CompleteSessionUseCase,
  AbandonSessionUseCase,
  GetDailyReportUseCase,
  GetWeeklyReportUseCase,
  GetMonthlyReportUseCase,
  UpdateSettingsUseCase,
} from './use-cases'

// Repository interfaces (for type checking)
import type { ISessionRepository, IReportRepository, ISettingsRepository } from '@domain/interfaces'

/**
 * Application Container
 *
 * Contains all initialized use cases and repositories.
 * This is a singleton that should be created once at application startup.
 */
export class AppContainer {
  // Repositories
  public readonly sessionRepository: ISessionRepository
  public readonly reportRepository: IReportRepository
  public readonly settingsRepository: ISettingsRepository

  // Session use cases
  public readonly startWorkUseCase: StartWorkUseCase
  public readonly startShortBreakUseCase: StartShortBreakUseCase
  public readonly startLongBreakUseCase: StartLongBreakUseCase
  public readonly pauseTimerUseCase: PauseTimerUseCase
  public readonly resumeTimerUseCase: ResumeTimerUseCase
  public readonly completeSessionUseCase: CompleteSessionUseCase
  public readonly abandonSessionUseCase: AbandonSessionUseCase

  // Report use cases
  public readonly getDailyReportUseCase: GetDailyReportUseCase
  public readonly getWeeklyReportUseCase: GetWeeklyReportUseCase
  public readonly getMonthlyReportUseCase: GetMonthlyReportUseCase

  // Settings use cases
  public readonly updateSettingsUseCase: UpdateSettingsUseCase

  constructor() {
    // Initialize repositories
    this.sessionRepository = new PostgreSQLSessionRepository(db)
    this.settingsRepository = new PostgreSQLSettingsRepository(db)

    // Initialize report repository with its components
    const dailyAggregateService = new DailyAggregateService(db)
    const dailyReportGenerator = new DailyReportGenerator(db, dailyAggregateService)
    const weeklyReportGenerator = new WeeklyReportGenerator(dailyReportGenerator)
    const monthlyReportGenerator = new MonthlyReportGenerator(dailyReportGenerator)

    // Create the report repository facade
    this.reportRepository = {
      getDailyReport: dailyReportGenerator.getDailyReport.bind(dailyReportGenerator),
      getWeeklyReport: weeklyReportGenerator.getWeeklyReport.bind(weeklyReportGenerator),
      getMonthlyReport: monthlyReportGenerator.getMonthlyReport.bind(monthlyReportGenerator),
      regenerateDailyAggregate: dailyAggregateService.regenerateDailyAggregate.bind(dailyAggregateService),
      getDailyReportsInRange: dailyReportGenerator.getDailyReportsInRange.bind(dailyReportGenerator),
      invalidateCache: async () => {
        // No-op for now, can implement cache invalidation later
      },
    }

    // Initialize session use cases
    this.startWorkUseCase = new StartWorkUseCase(this.sessionRepository, this.settingsRepository)
    this.startShortBreakUseCase = new StartShortBreakUseCase(this.sessionRepository, this.settingsRepository)
    this.startLongBreakUseCase = new StartLongBreakUseCase(this.sessionRepository, this.settingsRepository)
    this.pauseTimerUseCase = new PauseTimerUseCase(this.sessionRepository)
    this.resumeTimerUseCase = new ResumeTimerUseCase(this.sessionRepository)
    this.completeSessionUseCase = new CompleteSessionUseCase(this.sessionRepository)
    this.abandonSessionUseCase = new AbandonSessionUseCase(this.sessionRepository)

    // Initialize report use cases
    this.getDailyReportUseCase = new GetDailyReportUseCase(this.reportRepository)
    this.getWeeklyReportUseCase = new GetWeeklyReportUseCase(this.reportRepository)
    this.getMonthlyReportUseCase = new GetMonthlyReportUseCase(this.reportRepository)

    // Initialize settings use cases
    this.updateSettingsUseCase = new UpdateSettingsUseCase(this.settingsRepository)
  }

  /**
   * Cleanup method to close database connections
   */
  async cleanup(): Promise<void> {
    await db.end()
  }
}

// Singleton instance
let containerInstance: AppContainer | null = null

/**
 * Get the application container instance
 *
 * Creates a new instance on first call, returns the same instance on subsequent calls.
 */
export function getContainer(): AppContainer {
  if (!containerInstance) {
    containerInstance = new AppContainer()
  }
  return containerInstance
}

/**
 * Reset the container (useful for testing)
 */
export function resetContainer(): void {
  containerInstance = null
}
