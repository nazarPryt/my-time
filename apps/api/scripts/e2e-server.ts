import {
	INTEGRATION_API_PORT,
	INTEGRATION_DATABASE_URL,
} from '../../../scripts/e2e-integration-config'
import { app } from '../src/app'
import { client } from '../src/db'
import { runMigrations } from '../src/test/setup'

// The integration runner owns a disposable database, never the development DB.
if (process.env.DATABASE_URL !== INTEGRATION_DATABASE_URL) {
	throw new Error(
		'Integration server requires the disposable my_time_e2e database',
	)
}
await runMigrations()
app.listen({ port: INTEGRATION_API_PORT, hostname: '127.0.0.1' })
process.on('SIGTERM', async () => {
	await app.stop()
	await client.end()
	process.exit(0)
})
