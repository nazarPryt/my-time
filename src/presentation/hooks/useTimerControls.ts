import { useCallback } from 'react'
import { useAppStore } from '@presentation/store'
import { getContainer } from '@application/container'
import { TimerState } from '@domain/services'

/**
 * Hook to access timer control actions
 *
 * Provides methods to control the timer:
 * - Start work session
 * - Start break sessions
 * - Pause/Resume timer
 * - Complete/Abandon session
 */
export function useTimerControls() {
  const container = getContainer()

  // Get individual store actions and state
  const settings = useAppStore(state => state.settings)
  const currentSession = useAppStore(state => state.currentSession)
  const timerState = useAppStore(state => state.timerState)
  const elapsedTime = useAppStore(state => state.elapsedTime)
  const pausedDuration = useAppStore(state => state.pausedDuration)
  const setCurrentSession = useAppStore(state => state.setCurrentSession)
  const setTimerState = useAppStore(state => state.setTimerState)
  const setRemainingTime = useAppStore(state => state.setRemainingTime)
  const setElapsedTime = useAppStore(state => state.setElapsedTime)
  const setPausedDuration = useAppStore(state => state.setPausedDuration)
  const setStartedAt = useAppStore(state => state.setStartedAt)
  const setPausedAt = useAppStore(state => state.setPausedAt)
  const addSession = useAppStore(state => state.addSession)
  const updateSession = useAppStore(state => state.updateSession)
  const reset = useAppStore(state => state.reset)

  const startWork = useCallback(
    async (tags?: string[], notes?: string) => {
      try {
        // Get user ID from settings (TODO: proper auth)
        const userId = settings?.userId || 'default-user'

        const session = await container.startWorkUseCase.execute({
          userId,
          tags,
          notes,
        })

        // Update store
        setCurrentSession(session)
        setTimerState(TimerState.WORK_ACTIVE)
        setRemainingTime(session.plannedDuration)
        setElapsedTime(0)
        setPausedDuration(0)
        setStartedAt(session.startedAt)
        setPausedAt(null)

        // Add to session history
        addSession(session)

        return session
      } catch (error) {
        console.error('Failed to start work session:', error)
        throw error
      }
    },
    [
      container,
      settings,
      setCurrentSession,
      setTimerState,
      setRemainingTime,
      setElapsedTime,
      setPausedDuration,
      setStartedAt,
      setPausedAt,
      addSession,
    ],
  )

  const startShortBreak = useCallback(
    async (tags?: string[], notes?: string) => {
      try {
        const userId = settings?.userId || 'default-user'

        const session = await container.startShortBreakUseCase.execute({
          userId,
          tags,
          notes,
        })

        setCurrentSession(session)
        setTimerState(TimerState.SHORT_BREAK_ACTIVE)
        setRemainingTime(session.plannedDuration)
        setElapsedTime(0)
        setPausedDuration(0)
        setStartedAt(session.startedAt)
        setPausedAt(null)
        addSession(session)

        return session
      } catch (error) {
        console.error('Failed to start short break:', error)
        throw error
      }
    },
    [
      container,
      settings,
      setCurrentSession,
      setTimerState,
      setRemainingTime,
      setElapsedTime,
      setPausedDuration,
      setStartedAt,
      setPausedAt,
      addSession,
    ],
  )

  const startLongBreak = useCallback(
    async (tags?: string[], notes?: string) => {
      try {
        const userId = settings?.userId || 'default-user'

        const session = await container.startLongBreakUseCase.execute({
          userId,
          tags,
          notes,
        })

        setCurrentSession(session)
        setTimerState(TimerState.LONG_BREAK_ACTIVE)
        setRemainingTime(session.plannedDuration)
        setElapsedTime(0)
        setPausedDuration(0)
        setStartedAt(session.startedAt)
        setPausedAt(null)
        addSession(session)

        return session
      } catch (error) {
        console.error('Failed to start long break:', error)
        throw error
      }
    },
    [
      container,
      settings,
      setCurrentSession,
      setTimerState,
      setRemainingTime,
      setElapsedTime,
      setPausedDuration,
      setStartedAt,
      setPausedAt,
      addSession,
    ],
  )

  const pause = useCallback(async () => {
    try {
      if (!currentSession) {
        throw new Error('No active session to pause')
      }

      const result = await container.pauseTimerUseCase.execute({
        sessionId: currentSession.id,
        pausedAt: new Date(),
        elapsedTime: elapsedTime,
      })

      updateSession(result.session.id, result.session)
      setCurrentSession(result.session)

      // Determine paused state based on current active state
      const pausedState =
        timerState === TimerState.WORK_ACTIVE
          ? TimerState.WORK_PAUSED
          : timerState === TimerState.SHORT_BREAK_ACTIVE
            ? TimerState.SHORT_BREAK_PAUSED
            : TimerState.LONG_BREAK_PAUSED

      setTimerState(pausedState)
      setPausedAt(new Date())

      return result.session
    } catch (error) {
      console.error('Failed to pause timer:', error)
      throw error
    }
  }, [container, currentSession, timerState, updateSession, setCurrentSession, setTimerState, setPausedAt])

  const resume = useCallback(async () => {
    try {
      if (!currentSession) {
        throw new Error('No active session to resume')
      }

      const updatedSession = await container.resumeTimerUseCase.execute({
        sessionId: currentSession.id,
        resumedAt: new Date(),
      })

      updateSession(updatedSession.id, updatedSession)
      setCurrentSession(updatedSession)
      setTimerState(updatedSession.sessionType === 'work' ? TimerState.WORK_ACTIVE : TimerState.SHORT_BREAK_ACTIVE)
      setPausedAt(null)

      return updatedSession
    } catch (error) {
      console.error('Failed to resume timer:', error)
      throw error
    }
  }, [container, currentSession, updateSession, setCurrentSession, setTimerState, setPausedAt])

  const complete = useCallback(async () => {
    try {
      if (!currentSession) {
        throw new Error('No active session to complete')
      }

      const updatedSession = await container.completeSessionUseCase.execute({
        sessionId: currentSession.id,
        completedAt: new Date(),
      })

      updateSession(updatedSession.id, updatedSession)
      reset()

      return updatedSession
    } catch (error) {
      console.error('Failed to complete session:', error)
      throw error
    }
  }, [container, currentSession, updateSession, reset])

  const abandon = useCallback(async () => {
    try {
      if (!currentSession) {
        throw new Error('No active session to abandon')
      }

      const updatedSession = await container.abandonSessionUseCase.execute({
        sessionId: currentSession.id,
        abandonedAt: new Date(),
      })

      updateSession(updatedSession.id, updatedSession)
      reset()

      return updatedSession
    } catch (error) {
      console.error('Failed to abandon session:', error)
      throw error
    }
  }, [container, currentSession, updateSession, reset])

  return {
    startWork,
    startShortBreak,
    startLongBreak,
    pause,
    resume,
    complete,
    abandon,
  }
}
