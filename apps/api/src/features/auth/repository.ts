import { db } from '@db'
import { refreshTokens, users } from '@db/schema'
import { eq } from 'drizzle-orm'

export const authRepository = {
	findByEmail: async (email: string) => {
		const [user] = await db.select().from(users).where(eq(users.email, email))
		return user ?? null
	},

	findById: async (id: string) => {
		const [user] = await db.select().from(users).where(eq(users.id, id))
		return user ?? null
	},

	create: async (data: {
		email: string
		name: string
		passwordHash: string
		timezone: string
	}) => {
		const [user] = await db.insert(users).values(data).returning()
		return user
	},
}

export const refreshTokenRepository = {
	save: async (token: string, userId: string, expiresAt: Date) => {
		await db.insert(refreshTokens).values({ token, userId, expiresAt })
	},

	exists: async (token: string) => {
		const [row] = await db
			.select()
			.from(refreshTokens)
			.where(eq(refreshTokens.token, token))
		return !!row
	},

	remove: async (token: string) => {
		await db.delete(refreshTokens).where(eq(refreshTokens.token, token))
	},
}
