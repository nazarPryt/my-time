import { z } from 'zod'

/**
 * Session Type Schema
 * Defines the three types of Pomodoro sessions
 */
export const SessionTypeSchema = z.enum(['work', 'short_break', 'long_break'])
export type SessionType = z.infer<typeof SessionTypeSchema>

/**
 * Session Status Schema
 * Defines the possible outcomes of a session
 */
export const SessionStatusSchema = z.enum(['completed', 'abandoned', 'interrupted'])
export type SessionStatus = z.infer<typeof SessionStatusSchema>

/**
 * Base Session Schema (without refinements)
 * Used as foundation for partial schemas
 */
const BaseSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  sessionType: SessionTypeSchema,
  status: SessionStatusSchema,
  plannedDuration: z.number().int().positive(),
  actualDuration: z.number().int().nonnegative(),
  startedAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
  pausedDuration: z.number().int().nonnegative().default(0),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
  pomodoroCount: z.number().int().min(1).max(4),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
})

/**
 * Session Schema
 * Complete schema for a Pomodoro session with all fields and validation
 */
export const SessionSchema = BaseSessionSchema.refine(
  data => {
    if (data.completedAt && data.startedAt) {
      return data.completedAt.getTime() > data.startedAt.getTime()
    }
    return true
  },
  {
    message: 'completedAt must be after startedAt',
    path: ['completedAt'],
  },
).refine(
  data => {
    if (data.status === 'completed') {
      return data.completedAt !== null
    }
    return true
  },
  {
    message: 'completedAt must not be null when status is completed',
    path: ['completedAt'],
  },
)

export type Session = z.infer<typeof SessionSchema>

/**
 * Partial session schema for updates where not all fields are required
 */
export const PartialSessionSchema = BaseSessionSchema.partial()
export type PartialSession = z.infer<typeof PartialSessionSchema>

/**
 * Create session schema - for creating new sessions
 * Excludes auto-generated fields
 */
export const CreateSessionSchema = BaseSessionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export type CreateSession = z.infer<typeof CreateSessionSchema>
