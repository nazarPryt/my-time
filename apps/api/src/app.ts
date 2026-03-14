import cors from '@elysiajs/cors'
import { authPlugin } from '@features/auth/routes'
import { API_CONFIG } from '@shared/api-config'
import { Elysia } from 'elysia'

export const app = new Elysia()
	.use(cors({ origin: API_CONFIG.FRONTEND_WEB_URL }))
	.use(authPlugin)
	.get('/', () => 'ok')

export type App = typeof app
