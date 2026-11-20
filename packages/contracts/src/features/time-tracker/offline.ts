import { isBefore } from 'date-fns'
import { z } from 'zod'
import { SessionResponseSchema } from './session'
import { TimerSnapshotSchema } from './timer'

/** Timestamps are observations; the server owns accounting and reconciliation. */
export const OfflineSessionSchema = z
	.object({
		id: z.uuid(),
		startedAt: z.coerce.date(),
		endedAt: z.coerce.date().nullable(),
		originSessionId: z.uuid().nullable(),
	})
	.refine(
		(session) =>
			!session.endedAt || !isBefore(session.endedAt, session.startedAt),
		{
			message: 'A session cannot end before it starts',
		},
	)
export type OfflineSession = z.infer<typeof OfflineSessionSchema>

export const SyncOfflineSessionsRequestSchema = z
	.object({
		ownerId: z.uuid(),
		sessions: z.array(OfflineSessionSchema).min(1).max(100),
	})
	.refine(
		(request) =>
			new Set(request.sessions.map((session) => session.id)).size ===
				request.sessions.length &&
			request.sessions.filter((session) => !session.endedAt).length <= 1,
		{
			message: 'Session IDs must be unique and only one session may be running',
		},
	)
export type SyncOfflineSessionsRequest = z.infer<
	typeof SyncOfflineSessionsRequestSchema
>

/** Desktop journal validation lives with the shared session schemas. */
export const OfflineJournalSchema = z
	.object({
		version: z.literal(1),
		sessions: z.array(OfflineSessionSchema),
		confirmed: SessionResponseSchema.nullable(),
		timer: TimerSnapshotSchema.optional(),
		lastSuccessfulSyncAt: z.coerce.date().optional(),
	})
	.refine(
		(journal) =>
			journal.sessions.filter((session) => !session.endedAt).length <= 1,
	)
export type OfflineJournal = z.infer<typeof OfflineJournalSchema>
