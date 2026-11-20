import { z } from 'zod'
import { TimerSnapshotSchema } from './timer'

export const SessionTypeSchema = z.enum(['work'])
export type SessionType = z.infer<typeof SessionTypeSchema>

export const StartSessionRequestSchema = z.object({
	type: SessionTypeSchema,
})
export type StartSessionRequest = z.infer<typeof StartSessionRequestSchema>

export const SessionResponseSchema = z.object({
	id: z.string(),
	type: SessionTypeSchema,
	startedAt: z.coerce.date(),
	endedAt: z.coerce.date().nullable(),
	abandonedAt: z.coerce.date().nullable(),
})
export type SessionResponse = z.infer<typeof SessionResponseSchema>

export const TimerStateSchema = z.object({
	activeSession: SessionResponseSchema.nullable(),
	timer: TimerSnapshotSchema,
})
export type TimerState = z.infer<typeof TimerStateSchema>

/** Every snapshot is authoritative; reconnects do not replay past events. */
export const SESSION_STREAM_EVENT = 'session-state' as const
export const SessionStreamStateSchema = z.object({
	version: z.literal(1),
	activeSession: SessionResponseSchema.nullable(),
	// Optional during rolling upgrades; new servers always provide this.
	timer: TimerSnapshotSchema.optional(),
})
export type SessionStreamState = z.infer<typeof SessionStreamStateSchema>

export const TodaySummaryResponseSchema = z.object({
	sessions: z.array(SessionResponseSchema),
	totalWorkSeconds: z.number(),
	sessionsCompleted: z.number(),
	longestSessionSeconds: z.number(),
	timer: TimerSnapshotSchema.optional(),
})
export type TodaySummaryResponse = z.infer<typeof TodaySummaryResponseSchema>

export const DailySummarySchema = z.object({
	date: z.coerce.date(),
	totalWorkSeconds: z.number(),
	sessionsCompleted: z.number(),
})
export type DailySummary = z.infer<typeof DailySummarySchema>

export const WeeklySummaryResponseSchema = z.object({
	days: z.array(DailySummarySchema),
	currentStreakDays: z.number(),
})
export type WeeklySummaryResponse = z.infer<typeof WeeklySummaryResponseSchema>
