import { connectToDatabase } from '@db/connect'
import { runMigrations } from '@db/migrate'
import { scheduleAuthJobs } from '@features/auth/jobs'
import { syncEnglishQuizContent } from '@features/english-quiz/content/sync-content'
import { schedulePermessoJobs } from '@features/permesso/jobs'
import { startTelegramBot } from '@features/permesso/telegram/bot'
import { startTelegramLinkListener } from '@features/permesso/telegram/link-events'
import { startSessionListener } from '@features/time-tracker/session-listener'
import { API_CONFIG } from '@shared/api-config'
import { logger } from '@shared/logger'
import { app } from './app'

await connectToDatabase()

await runMigrations()
await syncEnglishQuizContent()

scheduleAuthJobs()
schedulePermessoJobs()
await startTelegramLinkListener()
await startSessionListener()
await startTelegramBot()

app.listen({ hostname: API_CONFIG.API_HOST, port: API_CONFIG.API_PORT })

logger.info(
	{ host: app.server?.hostname, port: app.server?.port },
	'server is up and running',
)
