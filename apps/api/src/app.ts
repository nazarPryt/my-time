import cors from '@elysiajs/cors'
import { authPlugin } from '@features/auth/routes'
import { API_CONFIG } from '@shared/api-config'
import { Elysia } from 'elysia'

export const API_PREFIX = '/api/v1'

export const app = new Elysia({ prefix: API_PREFIX })
	.use(cors({ origin: API_CONFIG.FRONTEND_WEB_URL }))
	.use(authPlugin)
	.get('/', () => '✅ my-time api — up and running')

export type App = typeof app
