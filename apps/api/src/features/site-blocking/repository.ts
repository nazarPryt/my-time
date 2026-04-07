import { db } from '@db'
import { blockedSites } from '@db/schema'
import { and, eq } from 'drizzle-orm'

export const blockedSitesRepository = {
	findByUserId: async (userId: string) => {
		return db.select().from(blockedSites).where(eq(blockedSites.userId, userId))
	},

	create: async (userId: string, domain: string) => {
		const [site] = await db
			.insert(blockedSites)
			.values({ userId, domain })
			.onConflictDoNothing()
			.returning()
		return site ?? null
	},

	deleteById: async (userId: string, id: string) => {
		await db
			.delete(blockedSites)
			.where(and(eq(blockedSites.id, id), eq(blockedSites.userId, userId)))
	},
}
