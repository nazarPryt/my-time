import { defineConfig, devices } from '@playwright/test'
import { API_PREFIX } from 'contracts'

import {
	INTEGRATION_API_URL as API_URL,
	INTEGRATION_DATABASE_URL,
	INTEGRATION_DESKTOP_URL,
	INTEGRATION_WEB_PORT,
	INTEGRATION_WEB_URL as WEB_URL,
} from '../../scripts/e2e-integration-config'

export default defineConfig({
	testDir: './e2e-integration',
	outputDir: './playwright-report/integration-artifacts',
	tsconfig: './tsconfig.integration.json',
	fullyParallel: false,
	workers: 1,
	forbidOnly: !!process.env.CI,
	retries: 0,
	reporter: 'list',
	use: { baseURL: WEB_URL, trace: 'retain-on-failure' },
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: [
		{
			command: 'bun run scripts/e2e-server.ts',
			cwd: '../api',
			url: `${API_URL}${API_PREFIX}/health`,
			reuseExistingServer: false,
			env: {
				NODE_ENV: 'test',
				DATABASE_URL: INTEGRATION_DATABASE_URL,
				JWT_SECRET: 'isolated-e2e-secret',
				API_URL,
				FRONTEND_WEB_URL: WEB_URL,
				PERMESSO_WEBSITE_URL: 'https://example.com',
				TELEGRAM_BOT_TOKEN: 'test-token',
				TELEGRAM_WEBHOOK_SECRET: 'test-secret',
				LOG_LEVEL: 'warn',
			},
		},
		{
			command: 'bun run integration/server.ts',
			cwd: '../desktop',
			url: `${INTEGRATION_DESKTOP_URL}/health`,
			reuseExistingServer: false,
		},
		{
			command: `bun run dev --port ${INTEGRATION_WEB_PORT} --strictPort`,
			url: WEB_URL,
			reuseExistingServer: false,
			env: { VITE_API_URL: API_URL },
		},
	],
})
