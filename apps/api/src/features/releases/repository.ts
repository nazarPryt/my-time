import { db } from '@db'
import { users } from '@db/schema'
import { eq } from 'drizzle-orm'

export const releasesRepository = {
	getLastSeenVersion: async (userId: string) => {
		const [row] = await db
			.select({ lastSeenVersion: users.lastSeenReleaseVersion })
			.from(users)
			.where(eq(users.id, userId))
		return row?.lastSeenVersion ?? null
	},

	setLastSeenVersion: async (userId: string, version: string) => {
		await db
			.update(users)
			.set({ lastSeenReleaseVersion: version, updatedAt: new Date() })
			.where(eq(users.id, userId))
	},
}
