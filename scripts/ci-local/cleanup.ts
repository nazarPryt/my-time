import { cleanupTask, type ProcessRunner } from '../shared/step-runner'
import { CI_COMPOSE_PROJECT } from './ci-local-lib'
import type { CiConfig } from './config'
import { composeDown, removeWorktree } from './resources'

// Returns false when the database could not be stopped, which fails the run.
export async function cleanUp({
	config,
	runner,
	databaseStarted,
	succeeded,
	interrupted,
}: {
	config: CiConfig
	runner: ProcessRunner
	databaseStarted: boolean
	succeeded: boolean
	interrupted: boolean
}): Promise<boolean> {
	console.info('\nCleanup')
	const databaseStopped =
		!databaseStarted ||
		(await cleanupTask(`Stop API-test database (${CI_COMPOSE_PROJECT})`, () =>
			composeDown(runner, config.root, CI_COMPOSE_PROJECT),
		))

	// A failed run keeps the worktree so its Playwright reports can be inspected.
	if ((succeeded && databaseStopped) || interrupted) {
		await cleanupTask(`Remove worktree ${config.worktree}`, () =>
			removeWorktree(runner, config),
		)
	} else {
		console.info(
			`  Worktree kept for its reports: ${config.worktree} (the next run removes it)`,
		)
	}
	if (!config.plain) console.info(`  Step logs: ${config.logDir}`)
	return databaseStopped
}
