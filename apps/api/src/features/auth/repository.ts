import { db } from '@db'
import { extensionTokens, refreshTokens, users } from '@db/schema'
import { and, eq, gt, lt } from 'drizzle-orm'

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
	}) => {
		const [user] = await db.insert(users).values(data).returning()
		return user
	},
}

export const refreshTokenRepository = {
	save: async (token: string, userId: string, expiresAt: Date) => {
		await db.insert(refreshTokens).values({ token, userId, expiresAt })
	},

	// Atomically deletes the token and returns the row if it existed.
	// Using DELETE...RETURNING prevents two concurrent requests from both
	// passing an exists() check before either removes the token.
	consume: async (token: string) => {
		const [row] = await db
			.delete(refreshTokens)
			.where(eq(refreshTokens.token, token))
			.returning()
		return row ?? null
	},

	remove: async (token: string) => {
		await db.delete(refreshTokens).where(eq(refreshTokens.token, token))
	},

	deleteExpired: async () => {
		await db
			.delete(refreshTokens)
			.where(lt(refreshTokens.expiresAt, new Date()))
	},
}

export const extensionTokenRepository = {
	create: async (userId: string, expiresAt: Date) => {
		const [row] = await db
			.insert(extensionTokens)
			.values({ userId, expiresAt })
			.returning()
		return row
	},

	// Atomically consume a valid (non-expired) token and return its userId.
	consume: async (token: string) => {
		const [row] = await db
			.delete(extensionTokens)
			.where(
				and(
					eq(extensionTokens.token, token),
					gt(extensionTokens.expiresAt, new Date()),
				),
			)
			.returning()
		return row ?? null
	},
}
