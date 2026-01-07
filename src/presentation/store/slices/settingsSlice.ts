import type { StateCreator } from 'zustand'
import type { UserSettings, PartialUserSettings } from '@shared/schemas'
import { createDefaultSettings } from '@shared/schemas'

export interface SettingsSlice {
  // State
  settings: UserSettings | null
  isLoadingSettings: boolean

  // Actions
  setSettings: (settings: UserSettings) => void
  updateSettings: (updates: PartialUserSettings) => void
  resetToDefaults: (userId: string) => void
  setIsLoadingSettings: (isLoading: boolean) => void
}

export const createSettingsSlice: StateCreator<
  SettingsSlice,
  [['zustand/devtools', never], ['zustand/persist', unknown], ['zustand/immer', never]],
  [],
  SettingsSlice
> = set => ({
  // Initial state
  settings: null,
  isLoadingSettings: false,

  // Actions
  setSettings: settings =>
    set(
      state => {
        state.settings = settings
      },
      undefined,
      'settings/setSettings',
    ),

  updateSettings: updates =>
    set(
      state => {
        if (state.settings) {
          state.settings = {
            ...state.settings,
            ...updates,
            updatedAt: new Date(),
          }
        }
      },
      undefined,
      'settings/updateSettings',
    ),

  resetToDefaults: userId =>
    set(
      state => {
        state.settings = createDefaultSettings(userId)
      },
      undefined,
      'settings/resetToDefaults',
    ),

  setIsLoadingSettings: isLoading =>
    set(
      state => {
        state.isLoadingSettings = isLoading
      },
      undefined,
      'settings/setIsLoadingSettings',
    ),
})
