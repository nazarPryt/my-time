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

	recordCheckResult: async (
		userId: string,
		result: PermessoCheckResult,
		triggeredBy: 'manual' | 'scheduled',
	) => {
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
			triggeredBy,
			checkedAt,
		})
	},

	updateCheckHours: async (
		userId: string,
		checkHours: number[],
		timezone: string,
	) => {
		const [row] = await db
			.update(permessoSubscriptions)
			.set({ checkHours, timezone, updatedAt: new Date() })
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

	setTelegramLinkToken: async (userId: string, linkToken: string) => {
		const [row] = await db
			.update(permessoSubscriptions)
			.set({ telegramLinkToken: linkToken, updatedAt: new Date() })
			.where(eq(permessoSubscriptions.userId, userId))
			.returning()
		return row ?? null
	},

	getByTelegramChatId: async (chatId: string) => {
		const [row] = await db
			.select()
			.from(permessoSubscriptions)
			.where(eq(permessoSubscriptions.telegramChatId, chatId))
		return row ?? null
	},

	linkTelegramChat: async (linkToken: string, chatId: string) => {
		const [row] = await db
			.update(permessoSubscriptions)
			.set({
				telegramChatId: chatId,
				telegramLinkToken: null,
				updatedAt: new Date(),
			})
			.where(eq(permessoSubscriptions.telegramLinkToken, linkToken))
			.returning()
		return row ?? null
	},

	disconnectTelegram: async (userId: string) => {
		const [row] = await db
			.update(permessoSubscriptions)
			.set({
				telegramChatId: null,
				telegramLinkToken: null,
				updatedAt: new Date(),
			})
			.where(eq(permessoSubscriptions.userId, userId))
			.returning()
		return row ?? null
	},
}
