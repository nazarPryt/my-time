import { resolve } from 'node:path'
import type { Subprocess } from 'bun'
import { E2E_COMPOSE_PROJECT } from './ci-local/ci-local-lib'
import {
	INTEGRATION_DATABASE_NAME,
	INTEGRATION_DATABASE_PORT,
} from './e2e-integration-config'
import { signalExitCode } from './shared/step-runner'

const root = resolve(import.meta.dir, '..')
const compose = [
	'docker',
	'compose',
	'-p',
	E2E_COMPOSE_PROJECT,
	'-f',
	'docker-compose.test.yml',
]
let child: Subprocess | undefined
let interrupted: NodeJS.Signals | undefined
let cleaningUp = false

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
	process.on(signal, () => {
		if (interrupted) return
		interrupted = signal
		if (!cleaningUp) child?.kill('SIGTERM')
	})
}

async function run(command: string[], cwd = root) {
	child = Bun.spawn(command, {
		cwd,
		stdout: 'inherit',
		stderr: 'inherit',
		env: {
			...process.env,
			TEST_DB_NAME: INTEGRATION_DATABASE_NAME,
			TEST_DB_PORT: String(INTEGRATION_DATABASE_PORT),
		},
	})
	try {
		return await child.exited
	} finally {
		child = undefined
	}
}
let exitCode = 1
try {
	// Clears a container left behind by a crashed run.
	await run([...compose, 'down', '--volumes'])
	const started = interrupted
		? 1
		: await run([...compose, 'up', '-d', '--wait'])
	if (started !== 0 && !interrupted)
		throw new Error('Disposable integration database failed to start')
	if (!interrupted) {
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
	}
} finally {
	cleaningUp = true
	await run([...compose, 'down', '--volumes'])
}
process.exit(interrupted ? signalExitCode(interrupted) : exitCode)
