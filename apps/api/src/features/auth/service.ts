import type { users } from '@db/schema'
import type { LoginRequest, RegisterRequest } from 'contracts'
import { MeResponseSchema } from 'contracts'
import { authRepository } from './repository'

function toPublicUser(u: typeof users.$inferSelect) {
	const { passwordHash: _, createdAt: __, updatedAt: ___, ...pub } = u
	return MeResponseSchema.parse(pub)
}

export const authService = {
	register: async (data: RegisterRequest) => {
		const existing = await authRepository.findByEmail(data.email)
		if (existing) throw new Error('EMAIL_TAKEN')

		const passwordHash = await Bun.password.hash(data.password)
		const user = await authRepository.create({
			email: data.email,
			name: data.name,
			passwordHash,
		})

		return toPublicUser(user)
	},

	login: async ({ email, password }: LoginRequest) => {
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
