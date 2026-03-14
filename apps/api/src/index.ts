import { API_CONFIG } from '@shared/api-config'
import { app } from './app'

app.listen({ hostname: API_CONFIG.HOSTNAME, port: API_CONFIG.PORT })

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
