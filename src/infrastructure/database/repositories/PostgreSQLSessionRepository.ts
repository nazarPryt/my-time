import { eq, and, gte, lte, desc, inArray } from 'drizzle-orm'
import type { ISessionRepository } from '@/domain/interfaces'
import type { Session, SessionType, SessionStatus } from '@/shared/schemas'
import { SessionSchema } from '@/shared/schemas'
import { db } from '../connection'
import { sessions, type NewSessionRow } from '../schemas'
import { startOfDay, endOfDay } from 'date-fns'

/**
 * PostgreSQL implementation of Session Repository
 * Handles all session persistence operations
 */
export class PostgreSQLSessionRepository implements ISessionRepository {
  /**
   * Save a new session to the database
   */
  async save(session: Session): Promise<Session> {
    const newSession: NewSessionRow = {
      id: session.id,
      userId: session.userId,
      sessionType: session.sessionType,
      status: session.status,
      plannedDuration: session.plannedDuration,
      actualDuration: session.actualDuration,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      pausedDuration: session.pausedDuration,
      tags: session.tags,
      notes: session.notes,
      pomodoroCount: session.pomodoroCount,
    }

    const [inserted] = await db.insert(sessions).values(newSession).returning()

    return this.mapToSession(inserted)
  }

  /**
   * Update an existing session
   */
  async update(session: Session): Promise<Session> {
    const [updated] = await db
      .update(sessions)
      .set({
        sessionType: session.sessionType,
        status: session.status,
        plannedDuration: session.plannedDuration,
        actualDuration: session.actualDuration,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        pausedDuration: session.pausedDuration,
        tags: session.tags,
        notes: session.notes,
        pomodoroCount: session.pomodoroCount,
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, session.id))
      .returning()

    if (!updated) {
      throw new Error(`Session with id ${session.id} not found`)
    }

    return this.mapToSession(updated)
  }

  /**
   * Find a session by ID
   */
  async findById(id: string): Promise<Session | null> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1)

    return session ? this.mapToSession(session) : null
  }

  /**
   * Find all sessions for a user within a date range
   */
  async findByUserAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Session[]> {
    const results = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.userId, userId), gte(sessions.startedAt, startDate), lte(sessions.startedAt, endDate)))
      .orderBy(desc(sessions.startedAt))

    return results.map(row => this.mapToSession(row))
  }

  /**
   * Find all sessions for a user on a specific date
   */
  async findByUserAndDate(userId: string, date: Date): Promise<Session[]> {
    const start = startOfDay(date)
    const end = endOfDay(date)

    return this.findByUserAndDateRange(userId, start, end)
  }

  /**
   * Delete a session by ID
   */
  async delete(id: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, id))
  }

  /**
   * Count sessions by user and type
   */
  async countByUserAndType(userId: string, type: SessionType): Promise<number> {
    const result = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.userId, userId), eq(sessions.sessionType, type)))

    return result.length
  }

  /**
   * Count sessions by user and status
   */
  async countByUserAndStatus(userId: string, status: SessionStatus): Promise<number> {
    const result = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.userId, userId), eq(sessions.status, status)))

    return result.length
  }

  /**
   * Find the most recent session for a user
   */
  async findMostRecent(userId: string): Promise<Session | null> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(desc(sessions.startedAt))
      .limit(1)

    return session ? this.mapToSession(session) : null
  }

  /**
   * Find sessions with specific tags
   */
  async findByTags(userId: string, tagList: string[]): Promise<Session[]> {
    // For PostgreSQL arrays, we need to check if any tag in the array matches
    const results = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(desc(sessions.startedAt))

    // Filter in-memory for tag matching since Drizzle doesn't have built-in array overlap
    const filtered = results.filter(row => {
      const sessionTags = row.tags || []
      return tagList.some(tag => sessionTags.includes(tag))
    })

    return filtered.map(row => this.mapToSession(row))
  }

  /**
   * Map database row to Session domain entity
   */
  private mapToSession(row: typeof sessions.$inferSelect): Session {
    return SessionSchema.parse({
      id: row.id,
      userId: row.userId,
      sessionType: row.sessionType,
      status: row.status,
      plannedDuration: row.plannedDuration,
      actualDuration: row.actualDuration,
      startedAt: row.startedAt,
      completedAt: row.completedAt,
      pausedDuration: row.pausedDuration,
      tags: row.tags,
      notes: row.notes,
      pomodoroCount: row.pomodoroCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }
}
