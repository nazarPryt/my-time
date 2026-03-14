import { defineConfig } from 'drizzle-kit'
import { API_CONFIG } from '@shared/api-config'

export default defineConfig({
	schema: './src/db/schema',
	out: './src/db/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: API_CONFIG.DATABASE_URL,
	},
})