import { connectToDatabase } from '@db/connect'
import { runMigrations } from '@db/migrate'
import { scheduleAuthJobs } from '@features/auth/jobs'
import { syncEnglishQuizContent } from '@features/english-quiz/content/sync-content'
import { schedulePermessoJobs } from '@features/permesso/jobs'
import { startTelegramBot } from '@features/permesso/telegram/bot'
import { startTelegramLinkListener } from '@features/permesso/telegram/link-events'
import { startSessionListener } from '@features/time-tracker/session-listener'
import { API_CONFIG } from '@shared/api-config'
import { APP_VERSION } from '@shared/app-version'
import { logger } from '@shared/logger'
import { startMetricsServer } from '@shared/metrics'
import { installProcessHandlers, onShutdown } from '@shared/process-handlers'
import { app } from './app'

installProcessHandlers()

await connectToDatabase()

await runMigrations()
await syncEnglishQuizContent()

scheduleAuthJobs()
schedulePermessoJobs()
await startTelegramLinkListener()
await startSessionListener()
await startTelegramBot()

app.listen({ hostname: API_CONFIG.API_HOST, port: API_CONFIG.API_PORT })
const metricsServer = startMetricsServer()

onShutdown(async () => {
	await app.stop()
	metricsServer?.stop(true)
})

logger.info(
	{ host: app.server?.hostname, port: app.server?.port, version: APP_VERSION },
	'server is up and running',
)
