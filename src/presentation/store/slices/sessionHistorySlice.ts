import type { StateCreator } from 'zustand'
import type { Session } from '@shared/schemas'

export interface SessionHistorySlice {
  // State
  todaySessions: Session[]
  recentSessions: Session[]
  isLoadingSessions: boolean

  // Actions
  setTodaySessions: (sessions: Session[]) => void
  setRecentSessions: (sessions: Session[]) => void
  addSession: (session: Session) => void
  updateSession: (sessionId: string, updates: Partial<Session>) => void
  removeSession: (sessionId: string) => void
  setIsLoadingSessions: (isLoading: boolean) => void
  clearSessions: () => void
}

export const createSessionHistorySlice: StateCreator<
  SessionHistorySlice,
  [['zustand/immer', never], ['zustand/persist', unknown], ['zustand/devtools', never]],
  [],
  SessionHistorySlice
> = set => ({
  // Initial state
  todaySessions: [],
  recentSessions: [],
  isLoadingSessions: false,

  // Actions
  setTodaySessions: sessions =>
    set(
      state => {
        state.todaySessions = sessions
      },
      undefined,
      'sessionHistory/setTodaySessions',
    ),

  setRecentSessions: sessions =>
    set(
      state => {
        state.recentSessions = sessions
      },
      undefined,
      'sessionHistory/setRecentSessions',
    ),

  addSession: session =>
    set(
      state => {
        // Add to today's sessions if it's from today
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const sessionDate = new Date(session.startedAt)
        sessionDate.setHours(0, 0, 0, 0)

        if (sessionDate.getTime() === today.getTime()) {
          state.todaySessions.unshift(session)
        }

        // Add to recent sessions (keep only last 20)
        state.recentSessions.unshift(session)
        if (state.recentSessions.length > 20) {
          state.recentSessions = state.recentSessions.slice(0, 20)
        }
      },
      undefined,
      'sessionHistory/addSession',
    ),

  updateSession: (sessionId, updates) =>
    set(
      state => {
        // Update in today's sessions
        const todayIndex = state.todaySessions.findIndex(s => s.id === sessionId)
        if (todayIndex !== -1) {
          state.todaySessions[todayIndex] = {
            ...state.todaySessions[todayIndex],
            ...updates,
          }
        }

        // Update in recent sessions
        const recentIndex = state.recentSessions.findIndex(s => s.id === sessionId)
        if (recentIndex !== -1) {
          state.recentSessions[recentIndex] = {
            ...state.recentSessions[recentIndex],
            ...updates,
          }
        }
      },
      undefined,
      'sessionHistory/updateSession',
    ),

  removeSession: sessionId =>
    set(
      state => {
        state.todaySessions = state.todaySessions.filter(s => s.id !== sessionId)
        state.recentSessions = state.recentSessions.filter(s => s.id !== sessionId)
      },
      undefined,
      'sessionHistory/removeSession',
    ),

  setIsLoadingSessions: isLoading =>
    set(
      state => {
        state.isLoadingSessions = isLoading
      },
      undefined,
      'sessionHistory/setIsLoadingSessions',
    ),

  clearSessions: () =>
    set(
      state => {
        state.todaySessions = []
        state.recentSessions = []
      },
      undefined,
      'sessionHistory/clearSessions',
    ),
})
