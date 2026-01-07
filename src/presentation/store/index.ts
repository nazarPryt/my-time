import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import {
  createTimerSlice,
  createSessionHistorySlice,
  createReportsSlice,
  createSettingsSlice,
  createSyncSlice,
} from './slices'
import type { TimerSlice, SessionHistorySlice, ReportsSlice, SettingsSlice, SyncSlice } from './slices'

// Combined store type
export type AppStore = TimerSlice & SessionHistorySlice & ReportsSlice & SettingsSlice & SyncSlice

/**
 * Main application store combining all slices
 *
 * Middleware stack (from inner to outer):
 * 1. Immer - Enables mutable state updates (converted to immutable internally)
 * 2. Persist - Persists state to localStorage
 * 3. Devtools - Enables Redux DevTools integration
 */
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((...args) => ({
        ...createTimerSlice(...args),
        ...createSessionHistorySlice(...args),
        ...createReportsSlice(...args),
        ...createSettingsSlice(...args),
        ...createSyncSlice(...args),
      })),
      {
        name: 'pomodoro-app-storage',
        // Partialize to only persist specific slices
        partialize: state => ({
          // Persist settings
          settings: state.settings,
          // Persist sync state for offline queue
          pendingOperations: state.pendingOperations,
          lastSyncAt: state.lastSyncAt,
          // Don't persist timer state (should reset on reload)
          // Don't persist loading states
          // Don't persist cached reports (should be refreshed)
        }),
      },
    ),
    {
      name: 'PomodoroApp',
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
)

// Export types
export type { AppStore }
export * from './slices'
