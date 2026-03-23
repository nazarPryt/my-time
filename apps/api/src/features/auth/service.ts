import type { MeResponse, RegisterRequest } from 'contracts'
import type { users } from '@db/schema'
import { authRepository } from './repository'

function toPublicUser(u: typeof users.$inferSelect): MeResponse {
	const { passwordHash: _, createdAt: __, updatedAt: ___, ...pub } = u
	return pub
}

export const authService = {
	register: async (data: RegisterRequest) => {
		const existing = await authRepository.findByEmail(data.email)
		if (existing) throw new Error('EMAIL_TAKEN')

		const passwordHash = await Bun.password.hash(data.password)
		const user = await authRepository.create({
			email: data.email,
			name: data.name,
			timezone: data.timezone ?? 'UTC',
			passwordHash,
		})

		return toPublicUser(user)
	},

	login: async (email: string, password: string) => {
		const user = await authRepository.findByEmail(email)
		if (!user) throw new Error('INVALID_CREDENTIALS')

		const valid = await Bun.password.verify(password, user.passwordHash)
		if (!valid) throw new Error('INVALID_CREDENTIALS')

		return toPublicUser(user)
	},

	getById: async (id: string) => {
		const user = await authRepository.findById(id)
		if (!user) throw new Error('NOT_FOUND')
		return toPublicUser(user)
	},
}
