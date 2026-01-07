import type { UserSettings as UserSettingsType } from '@/shared/schemas'
import { createDefaultSettings } from '@/shared/schemas'

/**
 * UserSettings Entity
 * Represents user preferences and configuration
 * Contains business logic for settings management
 */
export class UserSettings {
  constructor(private readonly data: UserSettingsType) {}

  get userId(): string {
    return this.data.userId
  }

  get workDuration(): number {
    return this.data.workDuration
  }

  get shortBreakDuration(): number {
    return this.data.shortBreakDuration
  }

  get longBreakDuration(): number {
    return this.data.longBreakDuration
  }

  get longBreakInterval(): number {
    return this.data.longBreakInterval
  }

  get autoStartBreaks(): boolean {
    return this.data.autoStartBreaks
  }

  get autoStartPomodoros(): boolean {
    return this.data.autoStartPomodoros
  }

  get notificationEnabled(): boolean {
    return this.data.notificationEnabled
  }

  get notificationSound(): string {
    return this.data.notificationSound
  }

  get dailyGoalPomodoros(): number {
    return this.data.dailyGoalPomodoros
  }

  get createdAt(): Date {
    return this.data.createdAt
  }

  get updatedAt(): Date {
    return this.data.updatedAt
  }

  /**
   * Get the raw data representation
   */
  toObject(): UserSettingsType {
    return { ...this.data }
  }

  /**
   * Get duration for a specific session type
   */
  getDurationForSessionType(sessionType: 'work' | 'short_break' | 'long_break'): number {
    switch (sessionType) {
      case 'work':
        return this.data.workDuration
      case 'short_break':
        return this.data.shortBreakDuration
      case 'long_break':
        return this.data.longBreakDuration
    }
  }

  /**
   * Check if a long break is due based on pomodoro count
   */
  isLongBreakDue(completedPomodoroCount: number): boolean {
    return completedPomodoroCount % this.data.longBreakInterval === 0
  }

  /**
   * Calculate daily goal in minutes
   */
  getDailyGoalInMinutes(): number {
    return (this.data.dailyGoalPomodoros * this.data.workDuration) / 60
  }

  /**
   * Calculate daily goal in seconds
   */
  getDailyGoalInSeconds(): number {
    return this.data.dailyGoalPomodoros * this.data.workDuration
  }

  /**
   * Check if settings are using default values
   */
  isDefault(): boolean {
    const defaults = createDefaultSettings(this.data.userId)
    return (
      this.data.workDuration === defaults.workDuration &&
      this.data.shortBreakDuration === defaults.shortBreakDuration &&
      this.data.longBreakDuration === defaults.longBreakDuration &&
      this.data.longBreakInterval === defaults.longBreakInterval &&
      this.data.autoStartBreaks === defaults.autoStartBreaks &&
      this.data.autoStartPomodoros === defaults.autoStartPomodoros &&
      this.data.notificationEnabled === defaults.notificationEnabled &&
      this.data.dailyGoalPomodoros === defaults.dailyGoalPomodoros
    )
  }

  /**
   * Format duration in human-readable format (e.g., "25m", "1h 30m")
   */
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }
    return `${minutes}m`
  }

  /**
   * Get formatted work duration
   */
  getFormattedWorkDuration(): string {
    return this.formatDuration(this.data.workDuration)
  }

  /**
   * Get formatted short break duration
   */
  getFormattedShortBreakDuration(): string {
    return this.formatDuration(this.data.shortBreakDuration)
  }

  /**
   * Get formatted long break duration
   */
  getFormattedLongBreakDuration(): string {
    return this.formatDuration(this.data.longBreakDuration)
  }

  /**
   * Create a new UserSettings entity with updated data
   */
  update(updates: Partial<UserSettingsType>): UserSettings {
    return new UserSettings({
      ...this.data,
      ...updates,
      userId: this.data.userId, // userId cannot be changed
      createdAt: this.data.createdAt, // createdAt cannot be changed
      updatedAt: new Date(),
    })
  }

  /**
   * Reset settings to default values
   */
  resetToDefaults(): UserSettings {
    const defaults = createDefaultSettings(this.data.userId)
    return new UserSettings({
      ...defaults,
      createdAt: this.data.createdAt, // Preserve original creation time
      updatedAt: new Date(),
    })
  }

  /**
   * Factory method to create a new UserSettings entity with default values
   */
  static createDefault(userId: string): UserSettings {
    return new UserSettings(createDefaultSettings(userId))
  }

  /**
   * Factory method to create a UserSettings entity from data
   */
  static fromObject(data: UserSettingsType): UserSettings {
    return new UserSettings(data)
  }
}
