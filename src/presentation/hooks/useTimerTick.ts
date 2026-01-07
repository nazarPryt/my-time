import { useEffect } from 'react'
import { useAppStore } from '@presentation/store'
import { TimerState } from '@domain/services'

/**
 * Hook to manage timer ticking
 *
 * Sets up an interval to tick the timer when active
 * Automatically completes the session when time runs out
 */
export function useTimerTick() {
  const store = useAppStore()
  const { timerState, remainingTime, tick, complete } = store

  useEffect(() => {
    // Only tick when timer is active
    const isActive =
      timerState === TimerState.WORK_ACTIVE ||
      timerState === TimerState.SHORT_BREAK_ACTIVE ||
      timerState === TimerState.LONG_BREAK_ACTIVE

    if (!isActive) {
      return
    }

    // Set up interval to tick every second
    const intervalId = setInterval(() => {
      if (remainingTime > 0) {
        tick()
      } else {
        // Timer completed - auto-complete the session
        complete().catch(error => {
          console.error('Failed to auto-complete session:', error)
        })
      }
    }, 1000)

    // Cleanup interval on unmount or when timer stops
    return () => clearInterval(intervalId)
  }, [timerState, remainingTime, tick, complete])
}
