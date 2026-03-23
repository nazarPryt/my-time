import { connectToDatabase } from '@db/connect'
import { API_CONFIG } from '@shared/api-config'
import { scheduleAuthJobs } from '@features/auth/jobs'
import { app } from './app'

await connectToDatabase()

scheduleAuthJobs()

app.listen({ hostname: API_CONFIG.API_HOST, port: API_CONFIG.API_PORT })

console.log(
	`🚀 Server is up and running at http://${app.server?.hostname}:${app.server?.port}`,
)
