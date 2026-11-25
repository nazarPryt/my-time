import { resolve } from 'node:path'
import {
	checkBrowser,
	checkDocker,
	checkPlaywrightChromium,
	checkPorts,
	commandOutput,
	type PreflightFailure,
	type ProcessRunner,
} from '../shared/step-runner'
import {
	CI_COMPOSE_PROJECT,
	E2E_COMPOSE_PROJECT,
	listUncommittedChanges,
	REQUIRED_PORTS,
	readBunVersion,
} from './ci-local-lib'
import { composeDown } from './resources'

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

function checkPuppeteerChrome(root: string) {
	return checkBrowser(root, {
		name: 'Puppeteer',
		cwd: 'apps/api',
		script:
			"console.log(await (await import('puppeteer')).default.executablePath())",
		fix: 'cd apps/api && bunx puppeteer browsers install chrome',
	})
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
	const status = await commandOutput(['git', 'status', '--porcelain'], root)
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
		checkPorts(REQUIRED_PORTS),
		checkPlaywrightChromium(root),
		checkPuppeteerChrome(root),
	])
	return [...checks.flat(), ...dockerFailures, ...checkGlibTools()]
}
