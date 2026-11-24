import { mkdir, rm } from 'node:fs/promises'
import { homedir, tmpdir } from 'node:os'
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
import {
	formatDuration,
	lastLine,
	paint,
	type StepState,
} from './ci-local/progress'
import { buildSteps, type Step, testCompose } from './ci-local/steps'
import { createTui } from './ci-local/tui'

const root = resolve(import.meta.dir, '..')
// Outside the repo so Biome, editors and `bun test` in the main tree never scan it.
const worktree = resolve(tmpdir(), 'my-time-ci-worktree')
const logDir = resolve(tmpdir(), 'my-time-ci-logs')
const timingsFile = resolve(
	process.env.XDG_CACHE_HOME ?? resolve(homedir(), '.cache'),
	'my-time-ci/timings.json',
)
const databaseName = 'my_time_ci'
const env = {
	...process.env,
	CI: 'true',
	VITE_API_URL: 'http://localhost:3000',
	TEST_DB_PORT: String(CI_DATABASE_PORT),
	TEST_DB_NAME: databaseName,
	DATABASE_URL: `postgres://postgres:postgres@127.0.0.1:${CI_DATABASE_PORT}/${databaseName}`,
}

const args = process.argv.slice(2)
if (args.some((arg) => arg !== '--plain')) {
	console.error('Usage: bun run ci:local [--plain]')
	process.exit(1)
}
// Pipes and --plain get the streamed output; a terminal gets the live step list.
const plain = args.includes('--plain') || !process.stdout.isTTY

let child: Subprocess | undefined
let interrupted: NodeJS.Signals | undefined
let cleaningUp = false

async function quiet(command: string[], cwd = root) {
	child = Bun.spawn(command, {
		cwd,
		env,
		stdio: ['ignore', 'ignore', 'ignore'],
	})
	try {
		return await child.exited
	} finally {
		child = undefined
	}
}

async function pipeTo(
	stream: ReadableStream<Uint8Array>,
	log: Bun.FileSink,
	state: StepState,
) {
	const decoder = new TextDecoder()
	for await (const chunk of stream) {
		log.write(chunk)
		state.lastLine =
			lastLine(decoder.decode(chunk, { stream: true })) ?? state.lastLine
	}
}

async function runStep(step: Step, state: StepState, logFile: string) {
	if (plain) {
		console.info(`\n> ${step.name}: ${step.command.join(' ')}`)
		child = Bun.spawn(step.command, {
			cwd: step.cwd,
			env,
			stdio: ['inherit', 'inherit', 'inherit'],
		})
		try {
			return await child.exited
		} finally {
			child = undefined
		}
	}
	const log = Bun.file(logFile).writer()
	log.write(`$ ${step.command.join(' ')}\n`)
	child = Bun.spawn(step.command, {
		cwd: step.cwd,
		env,
		stdio: ['ignore', 'pipe', 'pipe'],
	})
	try {
		const [code] = await Promise.all([
			child.exited,
			pipeTo(child.stdout as ReadableStream<Uint8Array>, log, state),
			pipeTo(child.stderr as ReadableStream<Uint8Array>, log, state),
		])
		return code
	} finally {
		child = undefined
		await log.end()
	}
}

async function cleanupTask(label: string, task: () => Promise<boolean>) {
	const started = Date.now()
	process.stdout.write(`  ${label}…`)
	const ok = await task()
	const mark = ok ? paint.green('✓') : paint.red('✗')
	const took = paint.dim(formatDuration(Date.now() - started))
	process.stdout.write(
		`${process.stdout.isTTY ? '\r\x1b[2K' : ' '}${mark} ${label}  ${took}\n`,
	)
	return ok
}

async function removeWorktree() {
	await rm(worktree, { recursive: true, force: true })
	return (await quiet(['git', 'worktree', 'prune'])) === 0
}

async function readTimings(): Promise<Record<string, number>> {
	try {
		return await Bun.file(timingsFile).json()
	} catch {
		return {}
	}
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
	process.on(signal, () => {
		if (interrupted) return
		interrupted = signal
		// Ctrl+C already reached the process group; this covers a SIGTERM sent to us alone.
		if (!cleaningUp) child?.kill('SIGTERM')
	})
}

// Leftovers from a crashed run would otherwise hold ports 5434/5435.
const dockerFailures = await checkDocker(root)
if (dockerFailures.length === 0) {
	await quiet([...testCompose(CI_COMPOSE_PROJECT), 'down', '--volumes'])
	await quiet([...testCompose(E2E_COMPOSE_PROJECT), 'down', '--volumes'])
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

const git = (...gitArgs: string[]) =>
	Bun.spawnSync(['git', ...gitArgs], { cwd: root })
		.stdout.toString()
		.trim()
const branch = git('branch', '--show-current')
const steps = buildSteps({ root, worktree, branch })
const states: StepState[] = steps.map(({ name }) => ({
	name,
	status: 'pending',
}))
const timings = await readTimings()
const startedAt = Date.now()
const logFile = (index: number) =>
	resolve(
		logDir,
		`${String(index + 1).padStart(2, '0')}-${steps[index].name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.log`,
	)
const tui = plain
	? undefined
	: createTui(() => ({
			title: `my-time local CI · ${git('log', '-1', '--format=%h %s')} · ${branch || 'detached'}`,
			states,
			timings,
			startedAt,
		}))

let databaseStarted = false
let failed: number | undefined
let exitCode = 1
try {
	await rm(logDir, { recursive: true, force: true })
	await mkdir(logDir, { recursive: true })
	await removeWorktree()
	tui?.start()
	for (const [index, step] of steps.entries()) {
		if (interrupted) break
		if (step.startsDatabase) databaseStarted = true
		const state = states[index]
		Object.assign(state, { status: 'running', startedAt: Date.now() })
		const code = await runStep(step, state, logFile(index))
		state.endedAt = Date.now()
		state.exitCode = code
		if (interrupted) {
			state.status = 'interrupted'
			break
		}
		if (code !== 0) {
			state.status = 'failed'
			failed = index
			break
		}
		state.status = 'passed'
		timings[step.name] = state.endedAt - (state.startedAt ?? state.endedAt)
	}
	if (!interrupted && failed === undefined) exitCode = 0
} catch (error) {
	console.error(error instanceof Error ? error.message : error)
} finally {
	cleaningUp = true
	tui?.stop()
	await Bun.write(timingsFile, JSON.stringify(timings, null, '\t')).catch(
		() => undefined,
	)

	if (failed !== undefined) {
		const step = steps[failed]
		console.error(
			paint.red(
				`\n✗ ${step.name} failed (exit ${states[failed].exitCode}): ${step.command.join(' ')}`,
			),
		)
		if (!plain) {
			const output = (await Bun.file(logFile(failed)).text())
				.trimEnd()
				.split('\n')
			console.error(
				paint.dim(
					`── last ${Math.min(output.length, 60)} lines of ${logFile(failed)} ──`,
				),
			)
			console.error(output.slice(-60).join('\n'))
		}
	}
	if (interrupted)
		console.error(paint.yellow(`\n${interrupted} received; cleaning up…`))

	console.info('\nCleanup')
	if (databaseStarted) {
		const ok = await cleanupTask(
			`Stop API-test database (${CI_COMPOSE_PROJECT})`,
			async () =>
				(await quiet([
					...testCompose(CI_COMPOSE_PROJECT),
					'down',
					'--volumes',
				])) === 0,
		)
		if (!ok) exitCode = 1
	}
	if (exitCode === 0 || interrupted) {
		await cleanupTask(`Remove worktree ${worktree}`, removeWorktree)
	} else {
		console.info(
			`  Worktree kept for its reports: ${worktree} (the next run removes it)`,
		)
	}
	if (!plain) console.info(`  Step logs: ${logDir}`)

	const total = formatDuration(Date.now() - startedAt)
	const code = interrupted ? signalExitCode(interrupted) : exitCode
	console.info(
		code === 0
			? paint.green(
					`\n✓ All ${steps.length} local CI steps passed in ${total}. Exit code 0.`,
				)
			: paint.red(`\n✗ Local CI failed after ${total}. Exit code ${code}.`),
	)
}
process.exit(interrupted ? signalExitCode(interrupted) : exitCode)
