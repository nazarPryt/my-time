import { useAppStore } from '@presentation/store'
import {
  selectTimerState,
  selectCurrentSession,
  selectRemainingTime,
  selectElapsedTime,
  selectStartedAt,
  selectPausedAt,
  selectProgress,
  selectFormattedRemainingTime,
} from '@presentation/store/selectors'

/**
 * Hook to access timer state
 *
 * Provides read-only access to the current timer state including:
 * - Current session
 * - Timer state (IDLE, WORK_ACTIVE, etc.)
 * - Remaining time
 * - Elapsed time
 * - Progress percentage
 * - Formatted time display
 */
export function useTimer() {
  const timerState = useAppStore(selectTimerState)
  const currentSession = useAppStore(selectCurrentSession)
  const remainingTime = useAppStore(selectRemainingTime)
  const elapsedTime = useAppStore(selectElapsedTime)
  const startedAt = useAppStore(selectStartedAt)
  const pausedAt = useAppStore(selectPausedAt)
  const progress = useAppStore(selectProgress)
  const formattedTime = useAppStore(selectFormattedRemainingTime)

  return {
    timerState,
    currentSession,
    remainingTime,
    elapsedTime,
    startedAt,
    pausedAt,
    progress,
    formattedTime,
  }
}
