import { API_CONFIG } from '@shared/api-config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: './src/db/schema',
	out: './src/db/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: API_CONFIG.DATABASE_URL,
	},
})
