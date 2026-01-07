import type { UserSettings, PartialUserSettings } from '@/shared/schemas'

/**
 * Settings Repository Interface
 * Defines the contract for user settings persistence
 * Handles CRUD operations for user preferences
 */
export interface ISettingsRepository {
  /**
   * Get user settings by user ID
   * Creates default settings if none exist
   * @param userId - The user ID
   * @returns User settings
   */
  getSettings(userId: string): Promise<UserSettings>

  /**
   * Update user settings
   * Merges partial updates with existing settings
   * @param userId - The user ID
   * @param settings - Partial settings to update
   * @returns Updated user settings
   */
  updateSettings(userId: string, settings: PartialUserSettings): Promise<UserSettings>

  /**
   * Reset user settings to default values
   * @param userId - The user ID
   * @returns Default user settings
   */
  resetToDefaults(userId: string): Promise<UserSettings>

  /**
   * Check if user settings exist
   * @param userId - The user ID
   * @returns True if settings exist, false otherwise
   */
  exists(userId: string): Promise<boolean>

  /**
   * Delete user settings
   * @param userId - The user ID
   */
  delete(userId: string): Promise<void>
}
