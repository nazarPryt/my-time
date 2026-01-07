/**
 * Barrel export for all domain interfaces
 * These interfaces define contracts for data access and external dependencies
 * Following Dependency Inversion Principle - domain defines interfaces, infrastructure implements them
 */

export type { ISessionRepository } from './ISessionRepository'
export type { IReportRepository } from './IReportRepository'
export type { ISettingsRepository } from './ISettingsRepository'
