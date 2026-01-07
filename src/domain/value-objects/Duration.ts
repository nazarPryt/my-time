/**
 * Duration Value Object
 * Represents a time duration in seconds
 * Immutable and self-validating
 */
export class Duration {
  private constructor(private readonly seconds: number) {
    if (seconds < 0) {
      throw new Error('Duration cannot be negative')
    }
    if (!Number.isInteger(seconds)) {
      throw new Error('Duration must be an integer number of seconds')
    }
  }

  /**
   * Get duration in seconds
   */
  toSeconds(): number {
    return this.seconds
  }

  /**
   * Get duration in minutes
   */
  toMinutes(): number {
    return this.seconds / 60
  }

  /**
   * Get duration in hours
   */
  toHours(): number {
    return this.seconds / 3600
  }

  /**
   * Format duration as HH:MM:SS
   */
  toTimeString(): string {
    const hours = Math.floor(this.seconds / 3600)
    const minutes = Math.floor((this.seconds % 3600) / 60)
    const secs = this.seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Format duration in human-readable format (e.g., "25m", "1h 30m", "2h")
   */
  toHumanReadable(): string {
    const hours = Math.floor(this.seconds / 3600)
    const minutes = Math.floor((this.seconds % 3600) / 60)
    const secs = this.seconds % 60

    if (hours > 0) {
      if (minutes > 0) {
        return `${hours}h ${minutes}m`
      }
      return `${hours}h`
    }

    if (minutes > 0) {
      if (secs > 0) {
        return `${minutes}m ${secs}s`
      }
      return `${minutes}m`
    }

    return `${secs}s`
  }

  /**
   * Add another duration to this one
   */
  add(other: Duration): Duration {
    return Duration.fromSeconds(this.seconds + other.seconds)
  }

  /**
   * Subtract another duration from this one
   */
  subtract(other: Duration): Duration {
    const result = this.seconds - other.seconds
    if (result < 0) {
      throw new Error('Cannot subtract a larger duration from a smaller one')
    }
    return Duration.fromSeconds(result)
  }

  /**
   * Multiply duration by a factor
   */
  multiply(factor: number): Duration {
    if (factor < 0) {
      throw new Error('Cannot multiply duration by a negative number')
    }
    return Duration.fromSeconds(Math.round(this.seconds * factor))
  }

  /**
   * Check if this duration is zero
   */
  isZero(): boolean {
    return this.seconds === 0
  }

  /**
   * Check if this duration is greater than another
   */
  isGreaterThan(other: Duration): boolean {
    return this.seconds > other.seconds
  }

  /**
   * Check if this duration is less than another
   */
  isLessThan(other: Duration): boolean {
    return this.seconds < other.seconds
  }

  /**
   * Check if this duration equals another
   */
  equals(other: Duration): boolean {
    return this.seconds === other.seconds
  }

  /**
   * Create a Duration from seconds
   */
  static fromSeconds(seconds: number): Duration {
    return new Duration(Math.round(seconds))
  }

  /**
   * Create a Duration from minutes
   */
  static fromMinutes(minutes: number): Duration {
    return new Duration(Math.round(minutes * 60))
  }

  /**
   * Create a Duration from hours
   */
  static fromHours(hours: number): Duration {
    return new Duration(Math.round(hours * 3600))
  }

  /**
   * Create a zero duration
   */
  static zero(): Duration {
    return new Duration(0)
  }

  /**
   * Standard Pomodoro work duration (25 minutes)
   */
  static standardWork(): Duration {
    return Duration.fromMinutes(25)
  }

  /**
   * Standard short break duration (5 minutes)
   */
  static standardShortBreak(): Duration {
    return Duration.fromMinutes(5)
  }

  /**
   * Standard long break duration (15 minutes)
   */
  static standardLongBreak(): Duration {
    return Duration.fromMinutes(15)
  }
}
