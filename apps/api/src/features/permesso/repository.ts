import { db } from '@db'
import { permessoChecks, permessoSubscriptions } from '@db/schema'
import { desc, eq } from 'drizzle-orm'
import type { PermessoCheckResult } from './checker'

export const permessoRepository = {
	getByUserId: async (userId: string) => {
		const [row] = await db
			.select()
			.from(permessoSubscriptions)
			.where(eq(permessoSubscriptions.userId, userId))
		return row ?? null
	},

	upsertPracticeNumber: async (userId: string, practiceNumber: string) => {
		const [row] = await db
			.insert(permessoSubscriptions)
			.values({ userId, practiceNumber })
			.onConflictDoUpdate({
				target: permessoSubscriptions.userId,
				set: {
					practiceNumber,
					lastStatus: null,
					lastError: null,
					lastCheckedAt: null,
					updatedAt: new Date(),
				},
			})
			.returning()
		return row
	},

	recordCheckResult: async (userId: string, result: PermessoCheckResult) => {
		const checkedAt = new Date()

		await db
			.update(permessoSubscriptions)
			.set({
				lastStatus: result.success ? result.status : null,
				lastError: result.success ? null : result.error,
				lastCheckedAt: checkedAt,
				updatedAt: checkedAt,
			})
			.where(eq(permessoSubscriptions.userId, userId))

		await db.insert(permessoChecks).values({
			userId,
			success: result.success,
			status: result.success ? result.status : null,
			error: result.success ? null : result.error,
			checkedAt,
		})
	},

	updateCheckHours: async (userId: string, checkHours: number[]) => {
		const [row] = await db
			.update(permessoSubscriptions)
			.set({ checkHours, updatedAt: new Date() })
			.where(eq(permessoSubscriptions.userId, userId))
			.returning()
		return row ?? null
	},

	listHistory: async (userId: string, limit = 20) => {
		return db
			.select()
			.from(permessoChecks)
			.where(eq(permessoChecks.userId, userId))
			.orderBy(desc(permessoChecks.checkedAt))
			.limit(limit)
	},

	listAll: async () => {
		// Every row has a practiceNumber (set at creation), so no filter is needed —
		// a subscription only exists once a user has entered one.
		return db.select().from(permessoSubscriptions)
	},
}
