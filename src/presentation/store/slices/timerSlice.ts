import type { StateCreator } from 'zustand'
import type { Session } from '@shared/schemas'
import { TimerState } from '@domain/services'

export interface TimerSlice {
  // State
  currentSession: Session | null
  timerState: (typeof TimerState)[keyof typeof TimerState]
  remainingTime: number // in seconds
  elapsedTime: number // in seconds
  pausedDuration: number // in seconds
  startedAt: Date | null
  pausedAt: Date | null

  // Actions
  setCurrentSession: (session: Session | null) => void
  setTimerState: (state: (typeof TimerState)[keyof typeof TimerState]) => void
  setRemainingTime: (time: number) => void
  setElapsedTime: (time: number) => void
  setPausedDuration: (duration: number) => void
  setStartedAt: (date: Date | null) => void
  setPausedAt: (date: Date | null) => void
  tick: () => void
  reset: () => void
}

export const createTimerSlice: StateCreator<
  TimerSlice,
  [['zustand/devtools', never], ['zustand/persist', unknown], ['zustand/immer', never]],
  [],
  TimerSlice
> = set => ({
  // Initial state
  currentSession: null,
  timerState: TimerState.IDLE,
  remainingTime: 0,
  elapsedTime: 0,
  pausedDuration: 0,
  startedAt: null,
  pausedAt: null,

  // Actions
  setCurrentSession: session =>
    set(
      state => {
        state.currentSession = session
      },
      undefined,
      'timer/setCurrentSession',
    ),

  setTimerState: timerState =>
    set(
      state => {
        state.timerState = timerState
      },
      undefined,
      'timer/setTimerState',
    ),

  setRemainingTime: time =>
    set(
      state => {
        state.remainingTime = time
      },
      undefined,
      'timer/setRemainingTime',
    ),

  setElapsedTime: time =>
    set(
      state => {
        state.elapsedTime = time
      },
      undefined,
      'timer/setElapsedTime',
    ),

  setPausedDuration: duration =>
    set(
      state => {
        state.pausedDuration = duration
      },
      undefined,
      'timer/setPausedDuration',
    ),

  setStartedAt: date =>
    set(
      state => {
        state.startedAt = date
      },
      undefined,
      'timer/setStartedAt',
    ),

  setPausedAt: date =>
    set(
      state => {
        state.pausedAt = date
      },
      undefined,
      'timer/setPausedAt',
    ),

  tick: () =>
    set(
      state => {
        if (state.remainingTime > 0) {
          state.remainingTime -= 1
          state.elapsedTime += 1
        }
      },
      undefined,
      'timer/tick',
    ),

  reset: () =>
    set(
      state => {
        state.currentSession = null
        state.timerState = TimerState.IDLE
        state.remainingTime = 0
        state.elapsedTime = 0
        state.pausedDuration = 0
        state.startedAt = null
        state.pausedAt = null
      },
      undefined,
      'timer/reset',
    ),
})
