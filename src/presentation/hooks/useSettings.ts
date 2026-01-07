import { useCallback, useEffect } from 'react'
import { useAppStore } from '@presentation/store'
import { selectSettings, selectIsLoadingSettings } from '@presentation/store/selectors'
import { getContainer } from '@application/container'
import type { PartialUserSettings } from '@shared/schemas'

/**
 * Hook to access and manage user settings
 *
 * Provides:
 * - Current settings
 * - Loading state
 * - Update settings method
 */
export function useSettings() {
  const container = getContainer()
  const settings = useAppStore(selectSettings)
  const isLoading = useAppStore(selectIsLoadingSettings)
  const setSettings = useAppStore(state => state.setSettings)
  const setIsLoadingSettings = useAppStore(state => state.setIsLoadingSettings)

  const loadSettings = useCallback(async () => {
    try {
      setIsLoadingSettings(true)
      const userId = 'default-user' // TODO: get from auth
      const loadedSettings = await container.settingsRepository.getSettings(userId)
      setSettings(loadedSettings)
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setIsLoadingSettings(false)
    }
  }, [container, setSettings, setIsLoadingSettings])

  // Load settings on mount if not already loaded
  useEffect(() => {
    if (!settings && !isLoading) {
      loadSettings()
    }
  }, [settings, isLoading, loadSettings])

  const updateSettings = useCallback(
    async (updates: PartialUserSettings) => {
      try {
        if (!settings) {
          throw new Error('Settings not loaded')
        }

        setIsLoadingSettings(true)
        const updatedSettings = await container.updateSettingsUseCase.execute({
          userId: settings.userId,
          updates,
        })
        setSettings(updatedSettings)

        return updatedSettings
      } catch (error) {
        console.error('Failed to update settings:', error)
        throw error
      } finally {
        setIsLoadingSettings(false)
      }
    },
    [container, settings, setSettings, setIsLoadingSettings],
  )

  return {
    settings,
    isLoading,
    updateSettings,
    reload: loadSettings,
  }
}
