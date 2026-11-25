import { checkDatabaseHealth } from '@db/connect'
import cors from '@elysiajs/cors'
import { authPlugin } from '@features/auth/routes'
import { clientErrorsPlugin } from '@features/client-errors/routes'
import { englishQuizPlugin } from '@features/english-quiz/routes'
import { permessoPlugin } from '@features/permesso/routes'
import { releasesPlugin } from '@features/releases/routes'
import { siteBlockingPlugin } from '@features/site-blocking/routes'
import { timeTrackerPlugin } from '@features/time-tracker/routes'
import { workoutPlugin } from '@features/workout/routes'
import { API_PREFIX } from '@my-time/contracts'
import { API_CONFIG } from '@shared/api-config'
import { httpLoggerPlugin, REQUEST_ID_HEADER } from '@shared/http-logger'
import { Elysia } from 'elysia'

export const app = new Elysia({ prefix: API_PREFIX })
	.use(httpLoggerPlugin)
	.use(
		cors({
			origin: API_CONFIG.FRONTEND_WEB_URL,
			credentials: true,
			exposeHeaders: [REQUEST_ID_HEADER],
		}),
	)
	.use(authPlugin)
	.use(workoutPlugin)
	.use(timeTrackerPlugin)
	.use(siteBlockingPlugin)
	.use(permessoPlugin)
	.use(releasesPlugin)
	.use(englishQuizPlugin)
	.use(clientErrorsPlugin)
	.get('/', () => '✅ my-time api — up and running')
	.get('/health', async ({ status }) =>
		(await checkDatabaseHealth())
			? { status: 'ok' as const }
			: status('Service Unavailable', {
					status: 'database unavailable' as const,
				}),
	)

export type App = typeof app
