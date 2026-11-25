import { homedir, tmpdir } from 'node:os'
import { resolve } from 'node:path'
import type { Env } from '../shared/step-runner'

// Off the dev ports, so `bun run dev` can keep running.
export const API_PORT = 3200
export const GRAFANA_PORT = 3201
export const API_URL = `http://localhost:${API_PORT}`
export const GRAFANA_URL = `http://localhost:${GRAFANA_PORT}`
// Set in docker-compose.observability-test.yml.
export const GRAFANA_ADMIN = { user: 'admin', password: 'admin' }

export const COMPOSE_PROJECT = 'my-time-observability-test'

const FLAGS = ['--plain', '--keep']

export const USAGE = `Usage: bun run observability:test [${FLAGS.join('] [')}]

  --plain  stream every step's output instead of the live step list
  --keep   leave the stack running afterwards to look around Grafana`

export interface TestOptions {
	plain: boolean
	keep: boolean
}

export interface TestConfig extends TestOptions {
	root: string
	resultsDir: string
	logDir: string
	timingsFile: string
	env: Env
}

// docker-compose.observability.yml extends the prod file, whose variables
// the test stack doesn't use; set them so Compose doesn't warn about each one.
const PROD_ONLY_VARIABLES = [
	'API_URL',
	'FRONTEND_WEB_URL',
	'GRAFANA_ADMIN_PASSWORD',
	'JWT_SECRET',
	'PERMESSO_WEBSITE_URL',
	'POSTGRES_DB',
	'POSTGRES_PASSWORD',
	'POSTGRES_USER',
	'TELEGRAM_BOT_TOKEN',
	'TELEGRAM_WEBHOOK_SECRET',
	'VITE_API_URL',
]

// Undefined for unknown arguments.
export function parseArgs(
	args: string[],
	isTty: boolean,
): TestOptions | undefined {
	if (args.some((arg) => !FLAGS.includes(arg))) return undefined
	return {
		plain: args.includes('--plain') || !isTty,
		keep: args.includes('--keep'),
	}
}

export function createConfig(
	root: string,
	options: TestOptions,
	processEnv: Env = process.env,
): TestConfig {
	const cacheDir = processEnv.XDG_CACHE_HOME ?? resolve(homedir(), '.cache')
	return {
		...options,
		root,
		resultsDir: resolve(root, 'observability-test-results'),
		logDir: resolve(tmpdir(), 'my-time-observability-test-logs'),
		timingsFile: resolve(cacheDir, 'my-time-observability-test/timings.json'),
		env: {
			...Object.fromEntries(
				PROD_ONLY_VARIABLES.map((name) => [name, 'unused']),
			),
			...processEnv,
		},
	}
}

export function composeCommand(...args: string[]): string[] {
	return [
		'docker',
		'compose',
		'-p',
		COMPOSE_PROJECT,
		'-f',
		'docker-compose.observability.yml',
		'-f',
		'docker-compose.observability-test.yml',
		...args,
	]
}
