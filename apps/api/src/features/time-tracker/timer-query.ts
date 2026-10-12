import { timeSessions } from '@db/schema'
import type { SessionResponse } from 'contracts'
import { sql } from 'drizzle-orm'

export function dailyMilliseconds(start: Date, now: Date) {
	const currentTime = sql.param(now, timeSessions.startedAt)
	const dayStart = sql.param(start, timeSessions.startedAt)
	return sql<number>`coalesce(sum(greatest(0,
		extract(epoch from (least(coalesce(${timeSessions.endedAt}, ${currentTime}), ${currentTime})
		- greatest(${timeSessions.startedAt}, ${dayStart}))) * 1000)), 0)`.mapWith(
		Number,
	)
}

type ActiveRecord = Omit<SessionResponse, 'startedAt'> & { startedAt: string }

export function activeRecord() {
	return sql<ActiveRecord | null>`(jsonb_agg(jsonb_build_object(
		'id', ${timeSessions.id}, 'type', ${timeSessions.type},
		'startedAt', ${timeSessions.startedAt}, 'endedAt', null, 'abandonedAt', null
	)) filter (where ${timeSessions.endedAt} is null))->0`
}
