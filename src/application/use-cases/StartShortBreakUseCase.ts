import type { ISessionRepository } from '@domain/interfaces'
import type { ISettingsRepository } from '@domain/interfaces'
import { SessionSchema } from '@shared/schemas'
import type { Session } from '@shared/schemas'

export interface StartShortBreakInput {
  userId: string
  tags?: string[]
  notes?: string
}

export interface StartShortBreakOutput {
  session: Session
}

/**
 * Use Case: Start Short Break Session
 *
 * Creates a new short break session with duration from user settings.
 */
export class StartShortBreakUseCase {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly settingsRepository: ISettingsRepository,
  ) {}

  async execute(input: StartShortBreakInput): Promise<StartShortBreakOutput> {
    // Get user settings to determine break duration
    const settings = await this.settingsRepository.getSettings(input.userId)

    // Count completed work sessions today to determine pomodoro count
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todaySessions = await this.sessionRepository.findByUserAndDateRange(input.userId, today, tomorrow)

    // Count completed work sessions for pomodoro tracking
    const completedWorkSessions = todaySessions.filter(s => s.sessionType === 'work' && s.status === 'completed').length

    const pomodoroCount = (completedWorkSessions % settings.longBreakInterval) + 1

    // Create new short break session
    const sessionData = {
      userId: input.userId,
      sessionType: 'short_break' as const,
      status: 'completed' as const,
      plannedDuration: settings.shortBreakDuration,
      actualDuration: 0,
      startedAt: new Date(),
      completedAt: null,
      pausedDuration: 0,
      tags: input.tags || [],
      notes: input.notes,
      pomodoroCount,
    }

    // Validate with schema
    const validatedData = SessionSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    }).parse(sessionData)

    // Save session
    const session = await this.sessionRepository.save({
      ...validatedData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return { session }
  }
}
