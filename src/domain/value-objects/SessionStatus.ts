import type { SessionStatus as SessionStatusEnum } from '@/shared/schemas'

/**
 * SessionStatus Value Object
 * Represents the outcome/status of a Pomodoro session
 * Provides type-safe operations and business logic
 */
export class SessionStatus {
  private constructor(private readonly status: SessionStatusEnum) {}

  /**
   * Get the raw session status value
   */
  getValue(): SessionStatusEnum {
    return this.status
  }

  /**
   * Check if session was completed successfully
   */
  isCompleted(): boolean {
    return this.status === 'completed'
  }

  /**
   * Check if session was abandoned by user
   */
  isAbandoned(): boolean {
    return this.status === 'abandoned'
  }

  /**
   * Check if session was interrupted (e.g., system sleep, app crash)
   */
  isInterrupted(): boolean {
    return this.status === 'interrupted'
  }

  /**
   * Check if session ended unsuccessfully (abandoned or interrupted)
   */
  isUnsuccessful(): boolean {
    return this.isAbandoned() || this.isInterrupted()
  }

  /**
   * Check if this session should count towards focus score
   * Only completed sessions count positively
   */
  countsTowardsFocusScore(): boolean {
    return this.isCompleted()
  }

  /**
   * Check if this session should count against focus score
   * Abandoned sessions count negatively
   */
  countsAgainstFocusScore(): boolean {
    return this.isAbandoned()
  }

  /**
   * Get human-readable display name
   */
  getDisplayName(): string {
    switch (this.status) {
      case 'completed':
        return 'Completed'
      case 'abandoned':
        return 'Abandoned'
      case 'interrupted':
        return 'Interrupted'
    }
  }

  /**
   * Get emoji representation
   */
  getEmoji(): string {
    switch (this.status) {
      case 'completed':
        return '✅'
      case 'abandoned':
        return '❌'
      case 'interrupted':
        return '⚠️'
    }
  }

  /**
   * Get color representation (for UI)
   */
  getColor(): string {
    switch (this.status) {
      case 'completed':
        return 'green'
      case 'abandoned':
        return 'red'
      case 'interrupted':
        return 'yellow'
    }
  }

  /**
   * Get description for user feedback
   */
  getDescription(): string {
    switch (this.status) {
      case 'completed':
        return 'Great job! You completed this session.'
      case 'abandoned':
        return 'Session was abandoned before completion.'
      case 'interrupted':
        return 'Session was interrupted unexpectedly.'
    }
  }

  /**
   * Check if this status equals another
   */
  equals(other: SessionStatus): boolean {
    return this.status === other.status
  }

  /**
   * Create a Completed status
   */
  static completed(): SessionStatus {
    return new SessionStatus('completed')
  }

  /**
   * Create an Abandoned status
   */
  static abandoned(): SessionStatus {
    return new SessionStatus('abandoned')
  }

  /**
   * Create an Interrupted status
   */
  static interrupted(): SessionStatus {
    return new SessionStatus('interrupted')
  }

  /**
   * Create a SessionStatus from a string value
   */
  static fromString(value: string): SessionStatus {
    switch (value) {
      case 'completed':
        return SessionStatus.completed()
      case 'abandoned':
        return SessionStatus.abandoned()
      case 'interrupted':
        return SessionStatus.interrupted()
      default:
        throw new Error(`Invalid session status: ${value}`)
    }
  }

  /**
   * Get all possible session statuses
   */
  static all(): SessionStatus[] {
    return [SessionStatus.completed(), SessionStatus.abandoned(), SessionStatus.interrupted()]
  }
}
