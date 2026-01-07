import type { AppStore } from '../index'

// ============================================================================
// Basic Selectors
// ============================================================================

// Timer selectors
export const selectTimerState = (state: AppStore) => state.timerState
export const selectCurrentSession = (state: AppStore) => state.currentSession
export const selectRemainingTime = (state: AppStore) => state.remainingTime
export const selectElapsedTime = (state: AppStore) => state.elapsedTime
export const selectPausedDuration = (state: AppStore) => state.pausedDuration
export const selectStartedAt = (state: AppStore) => state.startedAt
export const selectPausedAt = (state: AppStore) => state.pausedAt

// Session history selectors
export const selectTodaySessions = (state: AppStore) => state.todaySessions
export const selectRecentSessions = (state: AppStore) => state.recentSessions
export const selectIsLoadingSessions = (state: AppStore) => state.isLoadingSessions

// Reports selectors
export const selectDailyReport = (state: AppStore) => state.dailyReport
export const selectWeeklyReport = (state: AppStore) => state.weeklyReport
export const selectMonthlyReport = (state: AppStore) => state.monthlyReport
export const selectIsLoadingReports = (state: AppStore) => state.isLoadingReports
export const selectReportCacheTimestamp = (state: AppStore) => state.reportCacheTimestamp

// Settings selectors
export const selectSettings = (state: AppStore) => state.settings
export const selectIsLoadingSettings = (state: AppStore) => state.isLoadingSettings

// Sync selectors
export const selectIsSyncing = (state: AppStore) => state.isSyncing
export const selectLastSyncAt = (state: AppStore) => state.lastSyncAt
export const selectPendingOperations = (state: AppStore) => state.pendingOperations
export const selectSyncError = (state: AppStore) => state.syncError

// ============================================================================
// Computed Selectors (Memoized)
// ============================================================================

/**
 * Calculates the progress percentage of the current timer (0-100)
 */
export const selectProgress = (state: AppStore): number => {
  if (!state.currentSession) return 0

  const total = state.currentSession.plannedDuration
  const remaining = state.remainingTime

  if (total === 0) return 0

  const elapsed = total - remaining
  return Math.min(Math.max((elapsed / total) * 100, 0), 100)
}

/**
 * Calculates total work time for today in seconds
 */
export const selectTodayWorkTime = (state: AppStore): number => {
  return state.todaySessions
    .filter(session => session.sessionType === 'work' && session.status === 'completed')
    .reduce((total, session) => total + session.actualDuration, 0)
}

/**
 * Counts completed pomodoros today
 */
export const selectTodayPomodoroCount = (state: AppStore): number => {
  return state.todaySessions.filter(session => session.sessionType === 'work' && session.status === 'completed').length
}

/**
 * Determines if long break is due based on completed pomodoros and settings
 */
export const selectIsLongBreakDue = (state: AppStore): boolean => {
  if (!state.settings) return false

  const completedPomodoros = selectTodayPomodoroCount(state)
  return completedPomodoros > 0 && completedPomodoros % state.settings.longBreakInterval === 0
}

/**
 * Calculates completion rate for today (completed vs total sessions)
 */
export const selectCompletionRate = (state: AppStore): number => {
  const totalSessions = state.todaySessions.length
  if (totalSessions === 0) return 0

  const completedSessions = state.todaySessions.filter(session => session.status === 'completed').length

  return (completedSessions / totalSessions) * 100
}

/**
 * Gets the next recommended session type based on current state
 */
export const selectNextSessionType = (state: AppStore): 'work' | 'short_break' | 'long_break' => {
  if (selectIsLongBreakDue(state)) {
    return 'long_break'
  }

  // If last session was work, suggest break
  const lastSession = state.todaySessions[0]
  if (lastSession?.sessionType === 'work' && lastSession.status === 'completed') {
    return 'short_break'
  }

  // Default to work
  return 'work'
}

/**
 * Calculates progress towards daily goal
 */
export const selectDailyGoalProgress = (state: AppStore): number => {
  if (!state.settings) return 0

  const completedPomodoros = selectTodayPomodoroCount(state)
  const dailyGoal = state.settings.dailyGoalPomodoros

  if (dailyGoal === 0) return 0

  return Math.min((completedPomodoros / dailyGoal) * 100, 100)
}

/**
 * Checks if there are any pending sync operations
 */
export const selectHasPendingOperations = (state: AppStore): boolean => {
  return state.pendingOperations.length > 0
}

/**
 * Gets the count of pending operations by type
 */
export const selectPendingOperationsByType = (state: AppStore): Record<string, number> => {
  return state.pendingOperations.reduce(
    (acc, op) => {
      acc[op.type] = (acc[op.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
}

/**
 * Formats remaining time as MM:SS
 */
export const selectFormattedRemainingTime = (state: AppStore): string => {
  const totalSeconds = state.remainingTime
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Checks if a report cache is stale (older than 5 minutes)
 */
export const selectIsReportCacheStale = (state: AppStore, reportType: 'daily' | 'weekly' | 'monthly'): boolean => {
  const timestamp = state.reportCacheTimestamp[reportType]
  if (!timestamp) return true

  const FIVE_MINUTES = 5 * 60 * 1000
  return Date.now() - timestamp > FIVE_MINUTES
}
