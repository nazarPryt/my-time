import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: './e2e/dashboard/site-blocking/runtime',
	tsconfig: './tsconfig.e2e.json',
	workers: 1,
	outputDir: './test-results-extension',
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: 'list',
	use: { trace: 'retain-on-failure' },
	globalSetup: './e2e/dashboard/site-blocking/runtime/runtime.setup.ts',
})
