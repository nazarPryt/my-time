import type { ISessionRepository } from '@domain/interfaces'
import type { Session } from '@shared/schemas'

export interface PauseTimerInput {
  sessionId: string
  pausedAt: Date
  elapsedTime: number // Time elapsed since start in seconds
}

export interface PauseTimerOutput {
  session: Session
}

/**
 * Use Case: Pause Timer
 *
 * Pauses an active session and records the pause time.
 * This is used by the state machine when transitioning to paused states.
 */
export class PauseTimerUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(input: PauseTimerInput): Promise<PauseTimerOutput> {
    // Find the session
    const session = await this.sessionRepository.findById(input.sessionId)

    if (!session) {
      throw new Error(`Session not found: ${input.sessionId}`)
    }

    // Verify session is not already completed
    if (session.completedAt !== null) {
      throw new Error('Cannot pause a completed session')
    }

    // Update the session with pause information
    // Note: We don't update actualDuration here as the timer is paused
    // The pausedDuration will be calculated when resuming
    const updatedSession = await this.sessionRepository.update(session.id, {
      updatedAt: new Date(),
      // Store current elapsed time for reference
      actualDuration: input.elapsedTime,
    })

    return { session: updatedSession }
  }
}
