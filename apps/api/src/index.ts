import cors from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { authPlugin } from './features/auth/routes'
import { API_CONFIG } from './shared/api-config'

export const app = new Elysia()
	.use(cors({ origin: API_CONFIG.FRONTEND_WEB_URL }))
	.use(authPlugin)
	.get('/', () => 'ok')
	.listen({ hostname: API_CONFIG.HOSTNAME, port: API_CONFIG.PORT })

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app

export type { LoginRequest, LogoutRequest, RefreshRequest, RegisterRequest } from './features/auth/schemas'
export { LoginRequestSchema, LogoutRequestSchema, RefreshRequestSchema, RegisterRequestSchema } from './features/auth/schemas'
