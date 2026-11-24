import { existsSync } from 'node:fs'
import { createConnection } from 'node:net'
import { resolve } from 'node:path'
import {
	CI_COMPOSE_PROJECT,
	E2E_COMPOSE_PROJECT,
	findBusyPorts,
	listUncommittedChanges,
	type PreflightFailure,
	REQUIRED_PORTS,
	readBunVersion,
} from './ci-local-lib'
import type { ProcessRunner } from './process-runner'
import { composeDown } from './resources'

async function output(command: string[], cwd: string, timeout = 5000) {
	const child = Bun.spawn(command, {
		cwd,
		stdout: 'pipe',
		stderr: 'pipe',
		timeout,
	})
	const [code, stdout] = await Promise.all([
		child.exited,
		new Response(child.stdout).text(),
	])
	return { ok: code === 0, stdout }
}

function canConnect(host: string, port: number) {
	return new Promise<boolean>((done) => {
		const socket = createConnection({ host, port, timeout: 500 })
		const finish = (connected: boolean) => {
			socket.destroy()
			done(connected)
		}
		socket.once('connect', () => finish(true))
		socket.once('error', () => finish(false))
		socket.once('timeout', () => finish(false))
	})
}

// Vite may listen on ::1 only, Docker on 127.0.0.1 only.
async function isPortBusy(port: number) {
	const [v4, v6] = await Promise.all([
		canConnect('127.0.0.1', port),
		canConnect('::1', port),
	])
	return v4 || v6
}

export async function checkBunVersion(
	root: string,
): Promise<PreflightFailure[]> {
	const workflow = await Bun.file(
		resolve(root, '.github/workflows/ci.yml'),
	).text()
	const expected = readBunVersion(workflow)
	if (!expected) {
		return [
			{
				problem: 'BUN_VERSION not found in .github/workflows/ci.yml',
				fix: 'Keep a top-level `env: BUN_VERSION: x.y.z` in the workflow',
			},
		]
	}
	if (Bun.version === expected) return []
	return [
		{
			problem: `Bun ${Bun.version} does not match CI's ${expected}`,
			fix: `curl -fsSL https://bun.sh/install | bash -s "bun-v${expected}"`,
		},
	]
}

export async function checkDocker(root: string): Promise<PreflightFailure[]> {
	if (!Bun.which('docker')) {
		return [
			{
				problem: 'docker is not installed',
				fix: 'Install Docker with the compose plugin',
			},
		]
	}
	if (
		(await output(['docker', 'info', '--format', '{{.ServerVersion}}'], root))
			.ok
	)
		return []
	return [
		{
			problem: 'Docker daemon is not reachable',
			fix: 'Start Docker (./scripts/ensure-docker.sh) and check `docker info`',
		},
	]
}

export async function checkPorts(): Promise<PreflightFailure[]> {
	const busy = await findBusyPorts(REQUIRED_PORTS, isPortBusy)
	return busy.map(({ port, use }) => ({
		problem: `Port ${port} is in use (needed for the ${use})`,
		fix: `Stop whatever listens on it (\`ss -ltnp 'sport = :${port}'\`, \`docker ps\`), e.g. a running \`bun run dev\``,
	}))
}

async function checkBrowser(
	root: string,
	name: string,
	cwd: string,
	script: string,
	fix: string,
): Promise<PreflightFailure[]> {
	const { ok, stdout } = await output(['bun', '-e', script], resolve(root, cwd))
	const path = stdout.trim()
	if (ok && path && existsSync(path)) return []
	return [{ problem: `${name} Chromium is not installed`, fix }]
}

export function checkBrowsers(root: string): Promise<PreflightFailure[]>[] {
	return [
		checkBrowser(
			root,
			'Playwright',
			'apps/web',
			"console.log((await import('@playwright/test')).chromium.executablePath())",
			'bun apps/web/node_modules/@playwright/test/cli.js install --with-deps chromium',
		),
		checkBrowser(
			root,
			'Puppeteer',
			'apps/api',
			"console.log(await (await import('puppeteer')).default.executablePath())",
			'cd apps/api && bunx puppeteer browsers install chrome',
		),
	]
}

export function checkGlibTools(): PreflightFailure[] {
	return ['glib-compile-schemas', 'gsettings']
		.filter((tool) => !Bun.which(tool))
		.map((tool) => ({
			problem: `${tool} is not installed`,
			fix: 'sudo apt-get install -y libglib2.0-bin',
		}))
}

export async function checkCleanTree(
	root: string,
): Promise<PreflightFailure[]> {
	const status = await output(['git', 'status', '--porcelain'], root)
	const changes = listUncommittedChanges(status.stdout)
	if (status.ok && changes.length === 0) return []
	const shown = changes.slice(0, 10).join('\n')
	const more = changes.length > 10 ? `\n… and ${changes.length - 10} more` : ''
	return [
		{
			problem: `Working tree has uncommitted or untracked changes; CI checks only committed HEAD:\n${shown}${more}`,
			fix: 'Commit them, or set them aside with `git stash --include-untracked`',
		},
	]
}

// Runs every check and returns all problems at once, so one pass shows every fix.
export async function runPreflight(
	root: string,
	runner: ProcessRunner,
	{ allowDirty = false } = {},
): Promise<PreflightFailure[]> {
	const dockerFailures = await checkDocker(root)
	// Leftovers from a crashed run would otherwise hold ports 5434/5435.
	if (dockerFailures.length === 0) {
		await composeDown(runner, root, CI_COMPOSE_PROJECT)
		await composeDown(runner, root, E2E_COMPOSE_PROJECT)
	}
	const checks = await Promise.all([
		checkBunVersion(root),
		allowDirty ? [] : checkCleanTree(root),
		checkPorts(),
		...checkBrowsers(root),
	])
	return [...checks.flat(), ...dockerFailures, ...checkGlibTools()]
}
