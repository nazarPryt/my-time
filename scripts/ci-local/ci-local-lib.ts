import {
	INTEGRATION_API_PORT,
	INTEGRATION_DATABASE_PORT,
	INTEGRATION_DESKTOP_PORT,
	INTEGRATION_WEB_PORT,
} from '../e2e-integration-config'
import type { PortUse } from '../shared/step-runner'

export const CI_DATABASE_PORT = 5435
export const CI_COMPOSE_PROJECT = 'my-time-ci'
export const E2E_COMPOSE_PROJECT = 'my-time-e2e'

// With CI=true Playwright never reuses a running server, so any listener fails the run.
export const REQUIRED_PORTS: PortUse[] = [
	{
		port: 3000,
		use: 'web E2E API URL (a running API would answer unmocked requests)',
	},
	{ port: 5173, use: 'web E2E Vite server' },
	{
		port: INTEGRATION_WEB_PORT,
		use: 'english-quiz preview / integration web server',
	},
	{ port: INTEGRATION_API_PORT, use: 'integration API server' },
	{ port: INTEGRATION_DESKTOP_PORT, use: 'integration desktop controller' },
	{ port: INTEGRATION_DATABASE_PORT, use: 'integration Postgres' },
	{ port: CI_DATABASE_PORT, use: 'API-test Postgres' },
]

export function readBunVersion(workflow: string): string | undefined {
	return workflow.match(/^\s*BUN_VERSION:\s*['"]?([^'"\s#]+)/m)?.[1]
}

export function listUncommittedChanges(porcelain: string): string[] {
	return porcelain.split('\n').filter((line) => line.trim() !== '')
}
