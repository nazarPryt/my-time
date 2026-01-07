import type { SessionType as SessionTypeEnum } from '@/shared/schemas'

/**
 * SessionType Value Object
 * Represents the type of a Pomodoro session
 * Provides type-safe operations and business logic
 */
export class SessionType {
  private constructor(private readonly type: SessionTypeEnum) {}

  /**
   * Get the raw session type value
   */
  getValue(): SessionTypeEnum {
    return this.type
  }

  /**
   * Check if this is a work session
   */
  isWork(): boolean {
    return this.type === 'work'
  }

  /**
   * Check if this is a short break session
   */
  isShortBreak(): boolean {
    return this.type === 'short_break'
  }

  /**
   * Check if this is a long break session
   */
  isLongBreak(): boolean {
    return this.type === 'long_break'
  }

  /**
   * Check if this is any type of break session
   */
  isBreak(): boolean {
    return this.isShortBreak() || this.isLongBreak()
  }

  /**
   * Get human-readable display name
   */
  getDisplayName(): string {
    switch (this.type) {
      case 'work':
        return 'Work'
      case 'short_break':
        return 'Short Break'
      case 'long_break':
        return 'Long Break'
    }
  }

  /**
   * Get emoji representation
   */
  getEmoji(): string {
    switch (this.type) {
      case 'work':
        return '💼'
      case 'short_break':
        return '☕'
      case 'long_break':
        return '🌴'
    }
  }

  /**
   * Get color representation (for UI theming)
   */
  getColor(): string {
    switch (this.type) {
      case 'work':
        return 'red'
      case 'short_break':
        return 'green'
      case 'long_break':
        return 'blue'
    }
  }

  /**
   * Check if this session type equals another
   */
  equals(other: SessionType): boolean {
    return this.type === other.type
  }

  /**
   * Get the next session type based on Pomodoro rules
   * @param completedPomodoroCount - Number of completed pomodoros
   * @param longBreakInterval - Number of pomodoros before long break
   */
  getNextSessionType(completedPomodoroCount: number, longBreakInterval: number): SessionType {
    if (this.isWork()) {
      // After work, determine if it's time for a long break
      const isLongBreakDue = completedPomodoroCount % longBreakInterval === 0
      return isLongBreakDue ? SessionType.longBreak() : SessionType.shortBreak()
    } else {
      // After any break, return to work
      return SessionType.work()
    }
  }

  /**
   * Create a Work session type
   */
  static work(): SessionType {
    return new SessionType('work')
  }

  /**
   * Create a Short Break session type
   */
  static shortBreak(): SessionType {
    return new SessionType('short_break')
  }

  /**
   * Create a Long Break session type
   */
  static longBreak(): SessionType {
    return new SessionType('long_break')
  }

  /**
   * Create a SessionType from a string value
   */
  static fromString(value: string): SessionType {
    switch (value) {
      case 'work':
        return SessionType.work()
      case 'short_break':
        return SessionType.shortBreak()
      case 'long_break':
        return SessionType.longBreak()
      default:
        throw new Error(`Invalid session type: ${value}`)
    }
  }

  /**
   * Get all possible session types
   */
  static all(): SessionType[] {
    return [SessionType.work(), SessionType.shortBreak(), SessionType.longBreak()]
  }
}
