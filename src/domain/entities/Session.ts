import type { Session as SessionType, SessionStatus } from '@/shared/schemas'

/**
 * Session Entity
 * Represents a single Pomodoro session (work or break)
 * Contains business logic for session management
 */
export class Session {
  constructor(private readonly data: SessionType) {}

  get id(): string {
    return this.data.id
  }

  get userId(): string {
    return this.data.userId
  }

  get sessionType(): SessionType['sessionType'] {
    return this.data.sessionType
  }

  get status(): SessionStatus {
    return this.data.status
  }

  get plannedDuration(): number {
    return this.data.plannedDuration
  }

  get actualDuration(): number {
    return this.data.actualDuration
  }

  get startedAt(): Date {
    return this.data.startedAt
  }

  get completedAt(): Date | null {
    return this.data.completedAt
  }

  get pausedDuration(): number {
    return this.data.pausedDuration
  }

  get tags(): string[] {
    return this.data.tags
  }

  get notes(): string | undefined {
    return this.data.notes
  }

  get pomodoroCount(): number {
    return this.data.pomodoroCount
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
  toObject(): SessionType {
    return { ...this.data }
  }

  /**
   * Calculate remaining time for an active session
   * @param currentTime - The current timestamp (defaults to now)
   * @param totalPausedDuration - Total time paused in seconds
   * @returns Remaining time in seconds
   */
  calculateRemainingTime(
    currentTime: Date = new Date(),
    totalPausedDuration: number = this.data.pausedDuration,
  ): number {
    const elapsed = (currentTime.getTime() - this.data.startedAt.getTime()) / 1000 - totalPausedDuration
    const remaining = this.data.plannedDuration - elapsed
    return Math.max(0, Math.round(remaining))
  }

  /**
   * Calculate the progress percentage of the session
   * @param currentTime - The current timestamp
   * @param totalPausedDuration - Total time paused in seconds
   * @returns Progress percentage (0-100)
   */
  calculateProgress(currentTime: Date = new Date(), totalPausedDuration: number = this.data.pausedDuration): number {
    const elapsed = (currentTime.getTime() - this.data.startedAt.getTime()) / 1000 - totalPausedDuration
    const progress = (elapsed / this.data.plannedDuration) * 100
    return Math.min(100, Math.max(0, progress))
  }

  /**
   * Check if the session is completed
   */
  isCompleted(): boolean {
    return this.data.status === 'completed'
  }

  /**
   * Check if the session is abandoned
   */
  isAbandoned(): boolean {
    return this.data.status === 'abandoned'
  }

  /**
   * Check if the session is interrupted
   */
  isInterrupted(): boolean {
    return this.data.status === 'interrupted'
  }

  /**
   * Check if the session is a work session
   */
  isWorkSession(): boolean {
    return this.data.sessionType === 'work'
  }

  /**
   * Check if the session is a break session
   */
  isBreakSession(): boolean {
    return this.data.sessionType === 'short_break' || this.data.sessionType === 'long_break'
  }

  /**
   * Check if the session should trigger a long break
   * Long breaks occur after completing the configured interval of pomodoros
   */
  shouldTriggerLongBreak(longBreakInterval: number): boolean {
    return this.isWorkSession() && this.isCompleted() && this.data.pomodoroCount % longBreakInterval === 0
  }

  /**
   * Calculate the effective work time (actual duration minus paused time)
   */
  getEffectiveWorkTime(): number {
    return Math.max(0, this.data.actualDuration - this.data.pausedDuration)
  }

  /**
   * Calculate session efficiency (actual vs planned duration)
   * Returns 1.0 for perfect match, <1.0 for early finish, >1.0 for overtime
   */
  calculateEfficiency(): number {
    if (this.data.plannedDuration === 0) return 0
    return this.getEffectiveWorkTime() / this.data.plannedDuration
  }

  /**
   * Create a new Session entity with updated data
   */
  update(updates: Partial<SessionType>): Session {
    return new Session({
      ...this.data,
      ...updates,
      updatedAt: new Date(),
    })
  }

  /**
   * Factory method to create a new session
   */
  static create(params: {
    userId: string
    sessionType: SessionType['sessionType']
    plannedDuration: number
    pomodoroCount: number
    tags?: string[]
    notes?: string
  }): Session {
    return new Session({
      id: crypto.randomUUID(),
      userId: params.userId,
      sessionType: params.sessionType,
      status: 'completed', // Will be updated by use cases
      plannedDuration: params.plannedDuration,
      actualDuration: 0,
      startedAt: new Date(),
      completedAt: null,
      pausedDuration: 0,
      tags: params.tags ?? [],
      notes: params.notes,
      pomodoroCount: params.pomodoroCount,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}
