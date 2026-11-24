import { rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import type { Subprocess } from 'bun'
import {
	CI_COMPOSE_PROJECT,
	CI_DATABASE_PORT,
	E2E_COMPOSE_PROJECT,
	formatFailures,
	signalExitCode,
} from './ci-local/ci-local-lib'
import {
	checkBrowsers,
	checkBunVersion,
	checkCleanTree,
	checkDocker,
	checkGlibTools,
	checkPorts,
} from './ci-local/preflight'

const root = resolve(import.meta.dir, '..')
// Outside the repo so Biome, editors and `bun test` in the main tree never scan it.
const worktree = resolve(tmpdir(), 'my-time-ci-worktree')
const databaseName = 'my_time_ci'
const testCompose = (project: string) => [
	'docker',
	'compose',
	'-p',
	project,
	'-f',
	'docker-compose.test.yml',
]
const ciCompose = testCompose(CI_COMPOSE_PROJECT)
const env = {
	...process.env,
	CI: 'true',
	VITE_API_URL: 'http://localhost:3000',
	TEST_DB_PORT: String(CI_DATABASE_PORT),
	TEST_DB_NAME: databaseName,
	DATABASE_URL: `postgres://postgres:postgres@127.0.0.1:${CI_DATABASE_PORT}/${databaseName}`,
}
const steps = [
	['bun', 'install', '--frozen-lockfile'],
	['bun', 'run', 'lint:check'],
	['bun', '--filter', 'api', 'typecheck'],
	['bun', '--filter', 'web', 'typecheck'],
	['bun', '--filter', 'web', 'typecheck:e2e'],
	['bun', '--filter', 'english-quiz', 'typecheck'],
	['bun', '--filter', 'gnome-time-tracker', 'typecheck'],
	['bun', '--filter', 'gnome-time-tracker', 'typecheck:integration'],
	['bun', '--filter', 'gnome-player', 'typecheck'],
	['bun', '--filter', 'extension', 'compile'],
	['bun', '--bun', 'wxt', 'build'],
	['bun', '--filter', 'api', 'test'],
	['bun', '--filter', 'web', 'test'],
	['bun', '--filter', '@my-time/session-sync', 'test'],
	['bun', '--filter', 'english-quiz', 'test'],
	['bun', '--filter', '@my-time/contracts', 'test'],
	['bun', 'run', 'test:scripts'],
	['bun', '--filter', 'gnome-time-tracker', 'test'],
	['bun', '--filter', 'gnome-player', 'test'],
	['bun', '--filter', 'web', 'test:e2e'],
	['bun', 'run', 'test:web:e2e:extension'],
	['bun', 'run', 'test:web:e2e:integration'],
	['bun', '--filter', 'web', 'build'],
	['bun', '--filter', 'english-quiz', 'build'],
	[
		'env',
		'FRONTEND_WEB_URL=http://localhost:5173',
		'docker',
		'compose',
		'-p',
		CI_COMPOSE_PROJECT,
		'-f',
		'docker-compose.prod.yml',
		'build',
	],
	// Only dangling images; the build cache is pruned by hand (`bun run docker:prune`).
	['docker', 'image', 'prune', '-f'],
]

if (process.argv.slice(2).length) {
	console.error('Usage: bun run ci:local')
	process.exit(1)
}

let child: Subprocess | undefined
let interrupted: NodeJS.Signals | undefined
let cleaningUp = false

async function run(command: string[], cwd = worktree, quiet = false) {
	if (!quiet) console.info(`\n> ${command.join(' ')}`)
	child = Bun.spawn(command, {
		cwd: command[2] === 'wxt' ? resolve(cwd, 'apps/extensions/browser') : cwd,
		env,
		stdin: quiet ? 'ignore' : 'inherit',
		stdout: quiet ? 'ignore' : 'inherit',
		stderr: quiet ? 'ignore' : 'inherit',
	})
	try {
		return await child.exited
	} finally {
		child = undefined
	}
}

async function removeWorktree() {
	await rm(worktree, { recursive: true, force: true })
	await run(['git', 'worktree', 'prune'], root, true)
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
	process.on(signal, () => {
		if (interrupted) return
		interrupted = signal
		console.error(`\n${signal} received; stopping and cleaning up…`)
		// Ctrl+C already reached the process group; this covers a SIGTERM sent to us alone.
		if (!cleaningUp) child?.kill('SIGTERM')
	})
}

// Leftovers from a crashed run would otherwise hold ports 5434/5435.
const dockerFailures = await checkDocker(root)
if (dockerFailures.length === 0) {
	await run([...ciCompose, 'down', '--volumes'], root, true)
	await run(
		[...testCompose(E2E_COMPOSE_PROJECT), 'down', '--volumes'],
		root,
		true,
	)
}
const failures = (
	await Promise.all([
		checkBunVersion(root),
		checkCleanTree(root),
		checkPorts(),
		...checkBrowsers(root),
	])
).flat()
failures.push(...dockerFailures, ...checkGlibTools())
if (interrupted) process.exit(signalExitCode(interrupted))
if (failures.length) {
	console.error(formatFailures(failures))
	process.exit(1)
}

// dev is the branch PR'd into main, where CI also checks the release version.
const branch = Bun.spawnSync(['git', 'branch', '--show-current'], { cwd: root })
	.stdout.toString()
	.trim()
if (branch === 'dev') {
	steps.push(
		['git', 'fetch', 'origin', 'main', '--tags', '--quiet'],
		['bun', 'run', 'release:check', 'origin/main'],
	)
}

let databaseStarted = false
let exitCode = 1
try {
	await removeWorktree()
	if (
		(await run(
			['git', 'worktree', 'add', '--detach', worktree, 'HEAD'],
			root,
		)) !== 0
	) {
		throw new Error('Could not create the CI worktree')
	}
	for (const command of steps) {
		if (interrupted) break
		if (command.join(' ') === 'bun --filter api test') {
			// A separate project/database prevents API tests from clearing dev data.
			databaseStarted = true
			if ((await run([...ciCompose, 'up', '-d', '--wait'])) !== 0) {
				throw new Error(
					`Could not start the API-test database on port ${CI_DATABASE_PORT}`,
				)
			}
			if (interrupted) break
		}
		const code = await run(command)
		if (code !== 0) throw new Error(`Failed (${code}): ${command.join(' ')}`)
	}
	if (!interrupted) {
		console.info('\nAll local CI checks passed.')
		exitCode = 0
	}
} catch (error) {
	if (!interrupted)
		console.error(error instanceof Error ? error.message : error)
} finally {
	cleaningUp = true
	if (
		databaseStarted &&
		(await run([...ciCompose, 'down', '--volumes'], root)) !== 0
	) {
		console.error('Failed to clean up the local CI database.')
		exitCode = 1
	}
	if (exitCode === 0 || interrupted) await removeWorktree()
	else
		console.error(
			`\nReports and build output kept in ${worktree}; the next run removes it.`,
		)
}
process.exit(interrupted ? signalExitCode(interrupted) : exitCode)
