import { z } from 'zod'

export const SessionTypeSchema = z.enum(['work', 'break'])
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

export const TodaySummaryResponseSchema = z.object({
	sessions: z.array(SessionResponseSchema),
	totalWorkSeconds: z.number(),
	sessionsCompleted: z.number(),
	longestSessionSeconds: z.number(),
})
export type TodaySummaryResponse = z.infer<typeof TodaySummaryResponseSchema>

export const DailySummarySchema = z.object({
	date: z.string(),
	totalWorkSeconds: z.number(),
	sessionsCompleted: z.number(),
})
export type DailySummary = z.infer<typeof DailySummarySchema>

export const WeeklySummaryResponseSchema = z.object({
	days: z.array(DailySummarySchema),
	currentStreakDays: z.number(),
})
export type WeeklySummaryResponse = z.infer<typeof WeeklySummaryResponseSchema>
