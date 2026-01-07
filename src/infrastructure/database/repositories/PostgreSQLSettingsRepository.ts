import { eq } from 'drizzle-orm'
import type { ISettingsRepository } from '@/domain/interfaces'
import type { UserSettings, PartialUserSettings } from '@/shared/schemas'
import { UserSettingsSchema } from '@/shared/schemas'
import { db } from '../connection'
import { userSettings, type NewUserSettingsRow } from '../schemas'

/**
 * Default user settings values
 */
const DEFAULT_SETTINGS: Omit<UserSettings, 'userId' | 'createdAt' | 'updatedAt'> = {
  workDuration: 1500, // 25 minutes
  shortBreakDuration: 300, // 5 minutes
  longBreakDuration: 900, // 15 minutes
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  notificationEnabled: true,
  notificationSound: 'default',
  dailyGoalPomodoros: 8,
}

/**
 * PostgreSQL implementation of Settings Repository
 * Handles user preferences persistence
 */
export class PostgreSQLSettingsRepository implements ISettingsRepository {
  /**
   * Get user settings by user ID
   * Creates default settings if none exist
   */
  async getSettings(userId: string): Promise<UserSettings> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1)

    if (settings) {
      return this.mapToUserSettings(settings)
    }

    // Create default settings if none exist
    return this.createDefaultSettings(userId)
  }

  /**
   * Update user settings
   * Merges partial updates with existing settings
   */
  async updateSettings(userId: string, partialSettings: PartialUserSettings): Promise<UserSettings> {
    // Check if settings exist
    const exists = await this.exists(userId)

    if (!exists) {
      // Create new settings with provided values merged with defaults
      const newSettings: NewUserSettingsRow = {
        userId,
        ...DEFAULT_SETTINGS,
        ...partialSettings,
      }

      const [inserted] = await db.insert(userSettings).values(newSettings).returning()

      return this.mapToUserSettings(inserted)
    }

    // Update existing settings
    const [updated] = await db
      .update(userSettings)
      .set({
        ...partialSettings,
        updatedAt: new Date(),
      })
      .where(eq(userSettings.userId, userId))
      .returning()

    if (!updated) {
      throw new Error(`Settings for user ${userId} not found`)
    }

    return this.mapToUserSettings(updated)
  }

  /**
   * Reset user settings to default values
   */
  async resetToDefaults(userId: string): Promise<UserSettings> {
    const [updated] = await db
      .update(userSettings)
      .set({
        ...DEFAULT_SETTINGS,
        updatedAt: new Date(),
      })
      .where(eq(userSettings.userId, userId))
      .returning()

    if (updated) {
      return this.mapToUserSettings(updated)
    }

    // If settings don't exist, create them
    return this.createDefaultSettings(userId)
  }

  /**
   * Check if user settings exist
   */
  async exists(userId: string): Promise<boolean> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1)

    return !!settings
  }

  /**
   * Delete user settings
   */
  async delete(userId: string): Promise<void> {
    await db.delete(userSettings).where(eq(userSettings.userId, userId))
  }

  /**
   * Create default settings for a user
   */
  private async createDefaultSettings(userId: string): Promise<UserSettings> {
    const newSettings: NewUserSettingsRow = {
      userId,
      ...DEFAULT_SETTINGS,
    }

    const [inserted] = await db.insert(userSettings).values(newSettings).returning()

    return this.mapToUserSettings(inserted)
  }

  /**
   * Map database row to UserSettings domain entity
   */
  private mapToUserSettings(row: typeof userSettings.$inferSelect): UserSettings {
    return UserSettingsSchema.parse({
      userId: row.userId,
      workDuration: row.workDuration,
      shortBreakDuration: row.shortBreakDuration,
      longBreakDuration: row.longBreakDuration,
      longBreakInterval: row.longBreakInterval,
      autoStartBreaks: row.autoStartBreaks,
      autoStartPomodoros: row.autoStartPomodoros,
      notificationEnabled: row.notificationEnabled,
      notificationSound: row.notificationSound,
      dailyGoalPomodoros: row.dailyGoalPomodoros,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }
}
