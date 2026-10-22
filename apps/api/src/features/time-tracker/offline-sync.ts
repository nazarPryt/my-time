import { timeSessions } from '@db/schema'
import { logger } from '@shared/logger'
import type { OfflineSession, SyncOfflineSessionsRequest } from 'contracts'
import { addMinutes, isAfter, isBefore, isEqual, min } from 'date-fns'
import { and, eq, isNull, lte } from 'drizzle-orm'
import { mutateSessions } from './session-notifications'

export class OfflineSyncError extends Error {}

const open = and(isNull(timeSessions.endedAt), isNull(timeSessions.abandonedAt))

/** Imports observations atomically; a stop addresses its original session only. */
export async function syncOfflineSessions(
	userId: string,
	request: SyncOfflineSessionsRequest,
	now = new Date(),
): Promise<void> {
	if (request.ownerId !== userId)
		throw new OfflineSyncError('Offline work belongs to a different account.')
	for (const session of request.sessions) {
		if (
			isAfter(session.startedAt, addMinutes(now, 5)) ||
			(session.endedAt && isAfter(session.endedAt, addMinutes(now, 5)))
		)
			throw new OfflineSyncError(
				'Your desktop clock is ahead of the server. Correct it and retry.',
			)
	}
	await mutateSessions(userId, async (tx) => {
		for (const observation of request.sessions) {
			const session: OfflineSession = {
				...observation,
				startedAt: observation.startedAt,
				endedAt: observation.endedAt ? min([observation.endedAt, now]) : null,
			}
			const [existing] = await tx
				.select()
				.from(timeSessions)
				.where(eq(timeSessions.id, session.id))
			if (
				existing &&
				(existing.userId !== userId ||
					!existing.offline ||
					!isEqual(existing.startedAt, session.startedAt))
			)
				throw new OfflineSyncError('This offline session ID is already in use.')
			if (session.endedAt && session.originSessionId) {
				// Never stop a newer web session, or overwrite an already confirmed stop.
				await tx
					.update(timeSessions)
					.set({ endedAt: session.endedAt })
					.where(
						and(
							eq(timeSessions.id, session.originSessionId),
							eq(timeSessions.userId, userId),
							lte(timeSessions.startedAt, session.endedAt),
							open,
						),
					)
			}
			const [active] = await tx
				.select()
				.from(timeSessions)
				.where(and(eq(timeSessions.userId, userId), open))
			let endedAt = session.endedAt
			if (!endedAt && active?.id !== session.id && active) endedAt = now
			// Closed imported records can be extended on a lost-response retry, but
			// are never reopened. The returned active server session is adopted.
			if (existing?.endedAt && !endedAt) endedAt = now
			if (endedAt && isBefore(endedAt, session.startedAt))
				throw new OfflineSyncError('Invalid offline session interval.')
			if (existing) {
				if (!existing.abandonedAt)
					await tx
						.update(timeSessions)
						.set({ endedAt })
						.where(eq(timeSessions.id, session.id))
			} else {
				await tx.insert(timeSessions).values({
					id: session.id,
					userId,
					type: 'work',
					startedAt: session.startedAt,
					endedAt,
					offline: true,
				})
			}
		}
		return request.sessions
	})
	logger.info(
		{ userId, observations: request.sessions.length },
		'offline work synchronized',
	)
}
