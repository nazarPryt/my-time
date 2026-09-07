import { connectToDatabase } from '@db/connect'
import { runMigrations } from '@db/migrate'
import { scheduleAuthJobs } from '@features/auth/jobs'
import { API_CONFIG } from '@shared/api-config'
import { app } from './app'

await connectToDatabase()

await runMigrations()

scheduleAuthJobs()

app.listen({ hostname: API_CONFIG.API_HOST, port: API_CONFIG.API_PORT })

console.log(
	`🚀 Server is up and running at http://${app.server?.hostname}:${app.server?.port}`,
)
