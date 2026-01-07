import { useCallback, useEffect } from 'react'
import { useAppStore } from '@presentation/store'
import {
  selectTodaySessions,
  selectIsLoadingSessions,
  selectTodayWorkTime,
  selectTodayPomodoroCount,
  selectCompletionRate,
  selectDailyGoalProgress,
} from '@presentation/store/selectors'
import { getContainer } from '@application/container'

/**
 * Hook to access today's session data and statistics
 *
 * Provides:
 * - Today's sessions list
 * - Loading state
 * - Computed statistics (work time, pomodoro count, completion rate)
 * - Method to refresh data
 */
export function useTodaySessions() {
  const container = getContainer()
  const todaySessions = useAppStore(selectTodaySessions)
  const isLoading = useAppStore(selectIsLoadingSessions)
  const todayWorkTime = useAppStore(selectTodayWorkTime)
  const pomodoroCount = useAppStore(selectTodayPomodoroCount)
  const completionRate = useAppStore(selectCompletionRate)
  const dailyGoalProgress = useAppStore(selectDailyGoalProgress)
  const setIsLoadingSessions = useAppStore(state => state.setIsLoadingSessions)
  const setTodaySessions = useAppStore(state => state.setTodaySessions)

  const loadTodaySessions = useCallback(async () => {
    try {
      setIsLoadingSessions(true)
      const userId = 'default-user' // TODO: get from auth

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const sessions = await container.sessionRepository.findByUserAndDate(userId, today)
      setTodaySessions(sessions)
    } catch (error) {
      console.error('Failed to load today sessions:', error)
    } finally {
      setIsLoadingSessions(false)
    }
  }, [container, setIsLoadingSessions, setTodaySessions])

  // Load today's sessions on mount
  useEffect(() => {
    if (todaySessions.length === 0 && !isLoading) {
      loadTodaySessions()
    }
  }, [todaySessions.length, isLoading, loadTodaySessions])

  return {
    sessions: todaySessions,
    isLoading,
    todayWorkTime,
    pomodoroCount,
    completionRate,
    dailyGoalProgress,
    reload: loadTodaySessions,
  }
}
