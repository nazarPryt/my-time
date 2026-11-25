import { existsSync } from 'node:fs'
import { createConnection } from 'node:net'
import { resolve } from 'node:path'

export interface PreflightFailure {
	problem: string
	fix: string
}

export type PortUse = { port: number; use: string }

export function formatFailures(
	failures: PreflightFailure[],
	title: string,
): string {
	const lines = failures.map(
		({ problem, fix }) =>
			`  ✗ ${problem.replaceAll('\n', '\n      ')}\n    fix: ${fix}`,
	)
	return `${title}:\n\n${lines.join('\n\n')}`
}

/** Runs a short command quietly and returns whether it succeeded and its stdout. */
export async function commandOutput(
	command: string[],
	cwd: string,
	timeout = 5000,
) {
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

export async function findBusyPorts<P extends PortUse>(
	ports: P[],
	isBusy: (port: number) => Promise<boolean> = isPortBusy,
) {
	const busy = await Promise.all(ports.map(({ port }) => isBusy(port)))
	return ports.filter((_, index) => busy[index])
}

export async function checkPorts(
	ports: PortUse[],
): Promise<PreflightFailure[]> {
	const busy = await findBusyPorts(ports)
	return busy.map(({ port, use }) => ({
		problem: `Port ${port} is in use (needed for the ${use})`,
		fix: `Stop whatever listens on it (\`ss -ltnp 'sport = :${port}'\`, \`docker ps\`), e.g. a running \`bun run dev\``,
	}))
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
	const info = await commandOutput(
		['docker', 'info', '--format', '{{.ServerVersion}}'],
		root,
	)
	if (info.ok) return []
	return [
		{
			problem: 'Docker daemon is not reachable',
			fix: 'Start Docker (./scripts/ensure-docker.sh) and check `docker info`',
		},
	]
}

/** Fails when `script` (run with bun in `cwd`) doesn't print an existing browser path. */
export async function checkBrowser(
	root: string,
	{
		name,
		cwd,
		script,
		fix,
	}: { name: string; cwd: string; script: string; fix: string },
): Promise<PreflightFailure[]> {
	const { ok, stdout } = await commandOutput(
		['bun', '-e', script],
		resolve(root, cwd),
	)
	const path = stdout.trim()
	if (ok && path && existsSync(path)) return []
	return [{ problem: `${name} Chromium is not installed`, fix }]
}

/** Playwright's Chromium, for the workspace that depends on @playwright/test. */
export function checkPlaywrightChromium(root: string, cwd = 'apps/web') {
	return checkBrowser(root, {
		name: 'Playwright',
		cwd,
		script:
			"console.log((await import('@playwright/test')).chromium.executablePath())",
		fix: `bun ${cwd}/node_modules/@playwright/test/cli.js install --with-deps chromium`,
	})
}
