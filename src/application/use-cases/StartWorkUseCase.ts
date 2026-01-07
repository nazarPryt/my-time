import type { ISessionRepository } from '@domain/interfaces'
import type { ISettingsRepository } from '@domain/interfaces'
import { SessionSchema } from '@shared/schemas'
import type { Session } from '@shared/schemas'

export interface StartWorkInput {
  userId: string
  tags?: string[]
  notes?: string
}

export interface StartWorkOutput {
  session: Session
  pomodoroCount: number
}

/**
 * Use Case: Start Work Session
 *
 * Creates a new work session with duration from user settings.
 * Automatically determines the pomodoro count based on completed sessions today.
 */
export class StartWorkUseCase {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly settingsRepository: ISettingsRepository,
  ) {}

  async execute(input: StartWorkInput): Promise<StartWorkOutput> {
    // Get user settings to determine work duration
    const settings = await this.settingsRepository.getSettings(input.userId)

    // Count completed work sessions today to determine pomodoro number
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todaySessions = await this.sessionRepository.findByUserAndDateRange(input.userId, today, tomorrow)

    // Count completed work sessions
    const completedWorkSessions = todaySessions.filter(s => s.sessionType === 'work' && s.status === 'completed').length

    // Determine pomodoro count (1-4, cycling)
    const pomodoroCount = (completedWorkSessions % settings.longBreakInterval) + 1

    // Create new session
    const sessionData = {
      userId: input.userId,
      sessionType: 'work' as const,
      status: 'completed' as const, // Will be set properly when session completes
      plannedDuration: settings.workDuration,
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

    return {
      session,
      pomodoroCount,
    }
  }
}
