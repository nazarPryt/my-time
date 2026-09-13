import { jwt } from '@elysiajs/jwt'
import { API_CONFIG } from '@shared/api-config'
import { AUTH_ERRORS } from 'contracts'
import { Elysia } from 'elysia'

const jwtPlugin = jwt({
	name: 'jwt',
	secret: API_CONFIG.JWT_SECRET,
})

export const authMacro = new Elysia({ name: 'auth-macro' })
	.use(jwtPlugin)
	.macro({
		auth: {
			async resolve({ status, headers, jwt }) {
				const token = headers.authorization
				if (!token?.startsWith('Bearer ')) {
					return status('Unauthorized', AUTH_ERRORS.UNAUTHORIZED)
				}
				const payload = await jwt.verify(token.slice(7))
				if (!payload || typeof payload.sub !== 'string') {
					return status('Unauthorized', AUTH_ERRORS.UNAUTHORIZED)
				}
				return { userId: payload.sub }
			},
		},
	})
