import type { ISessionRepository } from '@domain/interfaces'
import type { Session } from '@shared/schemas'

export interface CompleteSessionInput {
  sessionId: string
  completedAt: Date
  actualDuration: number // Actual time spent on the session in seconds
}

export interface CompleteSessionOutput {
  session: Session
  wasSuccessful: boolean
}

/**
 * Use Case: Complete Session
 *
 * Marks a session as completed with the actual duration.
 * This is triggered by the state machine when a session timer completes.
 */
export class CompleteSessionUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(input: CompleteSessionInput): Promise<CompleteSessionOutput> {
    // Find the session
    const session = await this.sessionRepository.findById(input.sessionId)

    if (!session) {
      throw new Error(`Session not found: ${input.sessionId}`)
    }

    // Verify session is not already completed
    if (session.completedAt !== null) {
      throw new Error('Session is already completed')
    }

    // Update the session as completed
    const updatedSession = await this.sessionRepository.update(session.id, {
      status: 'completed',
      completedAt: input.completedAt,
      actualDuration: input.actualDuration,
      updatedAt: new Date(),
    })

    // Determine if session was successful (completed close to planned duration)
    // Allow up to 10% variance
    const variance = Math.abs(updatedSession.actualDuration - updatedSession.plannedDuration)
    const wasSuccessful = variance <= updatedSession.plannedDuration * 0.1

    return {
      session: updatedSession,
      wasSuccessful,
    }
  }
}
