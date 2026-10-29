import { resolve } from 'node:path'

const root = resolve(import.meta.dir, '..')
const databasePort = '5435'
const databaseName = 'my_time_ci'
const compose = [
	'docker',
	'compose',
	'-p',
	`my-time-ci-${process.pid}`,
	'-f',
	'docker-compose.test.yml',
]
const env = {
	...process.env,
	CI: 'true',
	VITE_API_URL: 'http://localhost:3000',
	TEST_DB_PORT: databasePort,
	TEST_DB_NAME: databaseName,
	DATABASE_URL: `postgres://postgres:postgres@127.0.0.1:${databasePort}/${databaseName}`,
}
const steps = [
	['bun', 'install', '--frozen-lockfile'],
	['bun', 'run', 'lint:check'],
	['bun', '--filter', 'api', 'typecheck'],
	['bun', '--filter', 'web', 'typecheck'],
	['bun', '--filter', 'web', 'typecheck:e2e'],
	['bun', '--filter', 'desktop', 'typecheck'],
	['bun', '--filter', 'desktop', 'typecheck:integration'],
	['bun', '--filter', 'extension', 'compile'],
	['bun', '--bun', 'wxt', 'build'],
	['bun', '--filter', 'api', 'test'],
	['bun', '--filter', 'web', 'test'],
	['bun', '--filter', '@my-time/session-sync', 'test'],
	['bun', '--filter', 'desktop', 'test'],
	['bun', '--filter', 'web', 'test:e2e'],
	['bun', 'run', 'test:web:e2e:extension'],
	['bun', 'run', 'test:web:e2e:integration'],
	['bun', '--filter', 'web', 'build'],
]

if (process.argv.slice(2).length) {
	console.error('Usage: bun run ci:local')
	process.exit(1)
}

async function run(command: string[]) {
	console.info(`\n> ${command.join(' ')}`)
	return Bun.spawn(command, {
		cwd: command[2] === 'wxt' ? resolve(root, 'apps/extension') : root,
		env,
		stdin: 'inherit',
		stdout: 'inherit',
		stderr: 'inherit',
	}).exited
}

let databaseStarted = false
let exitCode = 1
try {
	for (const command of steps) {
		if (command.join(' ') === 'bun --filter api test') {
			// A separate project/database prevents API tests from clearing dev data.
			databaseStarted = true
			if ((await run([...compose, 'up', '-d', '--wait'])) !== 0) {
				throw new Error(
					'Local CI requires a running Docker daemon and free port 5435',
				)
			}
		}
		const code = await run(command)
		if (code !== 0) throw new Error(`Failed (${code}): ${command.join(' ')}`)
	}
	console.info('\nAll local CI checks passed.')
	exitCode = 0
} catch (error) {
	console.error(error instanceof Error ? error.message : error)
} finally {
	if (databaseStarted && (await run([...compose, 'down', '--volumes'])) !== 0) {
		console.error('Failed to clean up the local CI database.')
		exitCode = 1
	}
}
process.exit(exitCode)
