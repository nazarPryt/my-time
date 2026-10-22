import { db } from '@db'
import { sql } from 'drizzle-orm'

export const SESSION_EVENTS_CHANNEL = 'time_session_changed'
type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

/** NOTIFY is delivered only on commit; publishing failure rolls back the write. */
export function mutateSessions<T>(
	userId: string,
	mutate: (transaction: Transaction) => Promise<T[]>,
): Promise<T[]> {
	return db.transaction(async (transaction) => {
		// Serialize account mutations, including offline imports and live starts.
		await transaction.execute(
			sql`select pg_advisory_xact_lock(hashtextextended(${userId}, 0))`,
		)
		const rows = await mutate(transaction)
		if (rows.length)
			await transaction.execute(
				sql`select pg_notify(${SESSION_EVENTS_CHANNEL}, ${userId})`,
			)
		return rows
	})
}
