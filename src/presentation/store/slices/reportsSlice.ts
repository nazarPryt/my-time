import type { StateCreator } from 'zustand'
import type { DailyReport, WeeklyReport, MonthlyReport } from '@shared/schemas'

export interface ReportsSlice {
  // State
  dailyReport: DailyReport | null
  weeklyReport: WeeklyReport | null
  monthlyReport: MonthlyReport | null
  isLoadingReports: boolean
  reportCacheTimestamp: {
    daily: number | null
    weekly: number | null
    monthly: number | null
  }

  // Actions
  setDailyReport: (report: DailyReport | null) => void
  setWeeklyReport: (report: WeeklyReport | null) => void
  setMonthlyReport: (report: MonthlyReport | null) => void
  setIsLoadingReports: (isLoading: boolean) => void
  invalidateCache: (reportType?: 'daily' | 'weekly' | 'monthly') => void
  clearReports: () => void
}

export const createReportsSlice: StateCreator<
  ReportsSlice,
  [['zustand/immer', never], ['zustand/persist', unknown], ['zustand/devtools', never]],
  [],
  ReportsSlice
> = set => ({
  // Initial state
  dailyReport: null,
  weeklyReport: null,
  monthlyReport: null,
  isLoadingReports: false,
  reportCacheTimestamp: {
    daily: null,
    weekly: null,
    monthly: null,
  },

  // Actions
  setDailyReport: report =>
    set(
      state => {
        state.dailyReport = report
        state.reportCacheTimestamp.daily = Date.now()
      },
      undefined,
      'reports/setDailyReport',
    ),

  setWeeklyReport: report =>
    set(
      state => {
        state.weeklyReport = report
        state.reportCacheTimestamp.weekly = Date.now()
      },
      undefined,
      'reports/setWeeklyReport',
    ),

  setMonthlyReport: report =>
    set(
      state => {
        state.monthlyReport = report
        state.reportCacheTimestamp.monthly = Date.now()
      },
      undefined,
      'reports/setMonthlyReport',
    ),

  setIsLoadingReports: isLoading =>
    set(
      state => {
        state.isLoadingReports = isLoading
      },
      undefined,
      'reports/setIsLoadingReports',
    ),

  invalidateCache: reportType =>
    set(
      state => {
        if (!reportType) {
          // Invalidate all caches
          state.reportCacheTimestamp.daily = null
          state.reportCacheTimestamp.weekly = null
          state.reportCacheTimestamp.monthly = null
        } else {
          // Invalidate specific cache
          state.reportCacheTimestamp[reportType] = null
        }
      },
      undefined,
      `reports/invalidateCache${reportType ? `/${reportType}` : ''}`,
    ),

  clearReports: () =>
    set(
      state => {
        state.dailyReport = null
        state.weeklyReport = null
        state.monthlyReport = null
        state.reportCacheTimestamp = {
          daily: null,
          weekly: null,
          monthly: null,
        }
      },
      undefined,
      'reports/clearReports',
    ),
})
