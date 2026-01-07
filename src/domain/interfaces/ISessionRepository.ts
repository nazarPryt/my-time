import type { Session } from '@/shared/schemas'
import type { SessionType, SessionStatus } from '@/shared/schemas'

/**
 * Session Repository Interface
 * Defines the contract for session data persistence
 * Follows the Repository pattern to abstract data access
 */
export interface ISessionRepository {
  /**
   * Save a new session to the repository
   * @param session - The session to save
   * @returns The saved session with generated ID
   */
  save(session: Session): Promise<Session>

  /**
   * Update an existing session
   * @param session - The session to update
   * @returns The updated session
   * @throws Error if session not found
   */
  update(session: Session): Promise<Session>

  /**
   * Find a session by its ID
   * @param id - The session ID
   * @returns The session if found, null otherwise
   */
  findById(id: string): Promise<Session | null>

  /**
   * Find all sessions for a user within a date range
   * @param userId - The user ID
   * @param startDate - Start of the date range
   * @param endDate - End of the date range
   * @returns Array of sessions within the date range
   */
  findByUserAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Session[]>

  /**
   * Find all sessions for a user on a specific date
   * @param userId - The user ID
   * @param date - The date to query
   * @returns Array of sessions for that date
   */
  findByUserAndDate(userId: string, date: Date): Promise<Session[]>

  /**
   * Delete a session by ID (soft delete recommended)
   * @param id - The session ID
   */
  delete(id: string): Promise<void>

  /**
   * Count sessions by user and type
   * @param userId - The user ID
   * @param type - The session type
   * @returns Number of sessions
   */
  countByUserAndType(userId: string, type: SessionType): Promise<number>

  /**
   * Count sessions by user and status
   * @param userId - The user ID
   * @param status - The session status
   * @returns Number of sessions
   */
  countByUserAndStatus(userId: string, status: SessionStatus): Promise<number>

  /**
   * Find the most recent session for a user
   * @param userId - The user ID
   * @returns The most recent session if found, null otherwise
   */
  findMostRecent(userId: string): Promise<Session | null>

  /**
   * Find sessions with specific tags
   * @param userId - The user ID
   * @param tags - Array of tags to search for
   * @returns Array of sessions containing any of the specified tags
   */
  findByTags(userId: string, tags: string[]): Promise<Session[]>
}
