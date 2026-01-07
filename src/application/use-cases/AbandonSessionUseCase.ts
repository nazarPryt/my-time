import type { ISessionRepository } from '@domain/interfaces'
import type { Session } from '@shared/schemas'

export interface AbandonSessionInput {
  sessionId: string
  abandonedAt: Date
  actualDuration: number // Time spent before abandoning in seconds
  reason?: string // Optional reason for abandoning
}

export interface AbandonSessionOutput {
  session: Session
}

/**
 * Use Case: Abandon Session
 *
 * Marks a session as abandoned when user stops it before completion.
 * This is triggered by the state machine when receiving an ABANDON event.
 */
export class AbandonSessionUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(input: AbandonSessionInput): Promise<AbandonSessionOutput> {
    // Find the session
    const session = await this.sessionRepository.findById(input.sessionId)

    if (!session) {
      throw new Error(`Session not found: ${input.sessionId}`)
    }

    // Verify session is not already completed
    if (session.completedAt !== null) {
      throw new Error('Cannot abandon a completed session')
    }

    // Update notes with abandon reason if provided
    const notes = input.reason
      ? session.notes
        ? `${session.notes}\n\nAbandoned: ${input.reason}`
        : `Abandoned: ${input.reason}`
      : session.notes

    // Update the session as abandoned
    const updatedSession = await this.sessionRepository.update(session.id, {
      status: 'abandoned',
      completedAt: input.abandonedAt,
      actualDuration: input.actualDuration,
      notes,
      updatedAt: new Date(),
    })

    return { session: updatedSession }
  }
}
