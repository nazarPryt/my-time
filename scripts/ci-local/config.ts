import { homedir, tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { CI_DATABASE_PORT } from './ci-local-lib'

const DATABASE_NAME = 'my_time_ci'

const FLAGS = ['--plain', '--dry-run', '--allow-dirty']

export const USAGE = `Usage: bun run ci:local [${FLAGS.join('] [')}]`

export type Env = Record<string, string | undefined>

export interface CiOptions {
	plain: boolean
	// Skips preflight and replaces every step with a no-op to preview the output.
	dryRun: boolean
	// Skips the clean-tree check; steps still test committed HEAD, not your edits.
	allowDirty: boolean
}

export interface CiConfig extends CiOptions {
	root: string
	worktree: string
	logDir: string
	timingsFile: string
	env: Env
}

// Undefined for unknown arguments.
export function parseArgs(
	args: string[],
	isTty: boolean,
): CiOptions | undefined {
	if (args.some((arg) => !FLAGS.includes(arg))) return undefined
	return {
		// Pipes and --plain get the streamed output; a terminal gets the live step list.
		plain: args.includes('--plain') || !isTty,
		dryRun: args.includes('--dry-run'),
		allowDirty: args.includes('--allow-dirty'),
	}
}

export function createConfig(
	root: string,
	options: CiOptions,
	processEnv: Env = process.env,
): CiConfig {
	const cacheDir = processEnv.XDG_CACHE_HOME ?? resolve(homedir(), '.cache')
	const stateDir =
		processEnv.XDG_STATE_HOME ?? resolve(homedir(), '.local/state')
	// A dry run gets its own folders so it never touches a real run's worktree or logs.
	const prefix = options.dryRun ? 'my-time-ci-dry-run' : 'my-time-ci'
	return {
		...options,
		root,
		// Not /tmp: Docker Desktop can't mount it. Not ~/.cache: Biome skips nested configs there.
		worktree: resolve(stateDir, `my-time-ci/${prefix}-worktree`),
		logDir: resolve(tmpdir(), `${prefix}-logs`),
		timingsFile: resolve(cacheDir, 'my-time-ci/timings.json'),
		env: {
			...processEnv,
			CI: 'true',
			VITE_API_URL: 'http://localhost:3000',
			TEST_DB_PORT: String(CI_DATABASE_PORT),
			TEST_DB_NAME: DATABASE_NAME,
			DATABASE_URL: `postgres://postgres:postgres@127.0.0.1:${CI_DATABASE_PORT}/${DATABASE_NAME}`,
		},
	}
}
