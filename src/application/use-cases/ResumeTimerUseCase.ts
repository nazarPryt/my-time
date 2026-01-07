import type { ISessionRepository } from '@domain/interfaces'
import type { Session } from '@shared/schemas'

export interface ResumeTimerInput {
  sessionId: string
  resumedAt: Date
  pausedDuration: number // Total time spent in pause state in seconds
}

export interface ResumeTimerOutput {
  session: Session
}

/**
 * Use Case: Resume Timer
 *
 * Resumes a paused session and updates the paused duration.
 * This is used by the state machine when transitioning from paused to active states.
 */
export class ResumeTimerUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(input: ResumeTimerInput): Promise<ResumeTimerOutput> {
    // Find the session
    const session = await this.sessionRepository.findById(input.sessionId)

    if (!session) {
      throw new Error(`Session not found: ${input.sessionId}`)
    }

    // Verify session is not already completed
    if (session.completedAt !== null) {
      throw new Error('Cannot resume a completed session')
    }

    // Update the session with accumulated paused duration
    const updatedSession = await this.sessionRepository.update(session.id, {
      pausedDuration: input.pausedDuration,
      updatedAt: new Date(),
    })

    return { session: updatedSession }
  }
}
