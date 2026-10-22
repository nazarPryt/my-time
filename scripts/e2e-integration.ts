import { resolve } from 'node:path'
import {
	INTEGRATION_DATABASE_NAME,
	INTEGRATION_DATABASE_PORT,
} from './e2e-integration-config'

const root = resolve(import.meta.dir, '..')
const compose = [
	'docker',
	'compose',
	'-p',
	'my-time-e2e',
	'-f',
	'docker-compose.test.yml',
]
async function run(command: string[], cwd = root) {
	return Bun.spawn(command, {
		cwd,
		stdout: 'inherit',
		stderr: 'inherit',
		env: {
			...process.env,
			TEST_DB_NAME: INTEGRATION_DATABASE_NAME,
			TEST_DB_PORT: String(INTEGRATION_DATABASE_PORT),
		},
	}).exited
}
let exitCode = 1
try {
	const started = await run([...compose, 'up', '-d', '--wait'])
	if (started !== 0)
		throw new Error('Disposable integration database failed to start')
	exitCode = await run(
		[
			'bun',
			'node_modules/@playwright/test/cli.js',
			'test',
			'--config',
			'playwright.integration.config.ts',
			...process.argv.slice(2),
		],
		resolve(root, 'apps/web'),
	)
} finally {
	await run([...compose, 'down', '--volumes'])
}
process.exit(exitCode)
