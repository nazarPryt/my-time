import { cleanupTask, type ProcessRunner } from '../shared/step-runner'
import { COMPOSE_PROJECT, composeCommand, type TestConfig } from './config'

// Returns false when the stack could not be removed, which fails the run.
export async function cleanUp({
	config,
	runner,
	stackStarted,
	interrupted,
}: {
	config: TestConfig
	runner: ProcessRunner
	stackStarted: boolean
	interrupted: boolean
}): Promise<boolean> {
	console.info('\nCleanup')
	let stackRemoved = true
	if (!stackStarted) {
		console.info('  Stack was never started')
	} else if (config.keep && !interrupted) {
		console.info(`  Stack kept running (--keep): ${COMPOSE_PROJECT}`)
	} else {
		stackRemoved = await cleanupTask(
			`Remove test stack (${COMPOSE_PROJECT})`,
			() => runner.succeeds(composeCommand('down', '--volumes'), config.root),
		)
	}
	if (!config.plain) console.info(`  Step logs: ${config.logDir}`)
	return stackRemoved
}
