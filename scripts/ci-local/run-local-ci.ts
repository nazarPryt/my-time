import {
	createStates,
	createTui,
	formatFailures,
	InterruptGuard,
	type PipelineOutcome,
	ProcessRunner,
	readTimings,
	reportInterrupt,
	resetLogDir,
	runPipeline,
	stepLogPath,
	writeTimings,
} from '../shared/step-runner'
import { cleanUp } from './cleanup'
import type { CiConfig } from './config'
import { runPreflight } from './preflight'
import { reportFailure, reportSummary } from './report'
import { git, removeWorktree } from './resources'
import { createStepRunner } from './step-runner'
import { buildSteps, reachedDatabaseStep, toDryRun } from './steps'

// preflight → run steps → report → clean up; resolves to the process exit code.
export async function runLocalCi(config: CiConfig): Promise<number> {
	const runner = new ProcessRunner(config.env)
	let cleaningUp = false
	const interrupts = new InterruptGuard(() => {
		// Ctrl+C already reached the process group; this covers a SIGTERM sent to us alone.
		if (!cleaningUp) runner.stop()
	})

	if (!config.dryRun) {
		const failures = await runPreflight(config.root, runner, config)
		if (interrupts.interrupted) return interrupts.exitCode(1)
		if (failures.length > 0) {
			console.error(formatFailures(failures, 'Local CI prerequisites not met'))
			return 1
		}
	}

	const branch = git(config.root, 'branch', '--show-current')
	const commit = git(config.root, 'log', '-1', '--format=%h %s')
	const realSteps = buildSteps({
		root: config.root,
		worktree: config.worktree,
		branch,
	})
	const steps = config.dryRun ? toDryRun(realSteps, config.root) : realSteps
	const states = createStates(steps)
	const timings = await readTimings(config.timingsFile)
	const logPath = (index: number) =>
		stepLogPath(config.logDir, index, steps[index].name)
	const startedAt = Date.now()
	const tui = config.plain
		? undefined
		: createTui({
				title: [
					config.dryRun ? 'my-time local CI (dry run)' : 'my-time local CI',
					commit,
					branch || 'detached',
				].join(' · '),
				states,
				timings,
				startedAt,
			})

	let outcome: PipelineOutcome | undefined
	try {
		await resetLogDir(config.logDir)
		await removeWorktree(runner, config)
		tui?.start()
		outcome = await runPipeline({
			steps,
			states,
			timings,
			runStep: createStepRunner({ runner, plain: config.plain, logPath }),
			isInterrupted: () => interrupts.interrupted,
		})
	} catch (error) {
		console.error(error instanceof Error ? error.message : error)
	} finally {
		cleaningUp = true
		tui?.stop()
		// Dry-run durations would wreck the ETA of the next real run.
		if (!config.dryRun) await writeTimings(config.timingsFile, timings)
	}

	if (outcome?.status === 'failed') {
		const { index } = outcome
		await reportFailure(
			steps[index],
			states[index],
			config.plain ? undefined : logPath(index),
		)
	}
	if (interrupts.signal) reportInterrupt(interrupts.signal)

	const succeeded = outcome?.status === 'passed' && !interrupts.interrupted
	const databaseStopped = await cleanUp({
		config,
		runner,
		databaseStarted: reachedDatabaseStep(steps, states),
		succeeded,
		interrupted: interrupts.interrupted,
	})

	const exitCode = interrupts.exitCode(succeeded && databaseStopped ? 0 : 1)
	reportSummary({
		exitCode,
		elapsedMs: Date.now() - startedAt,
		stepCount: steps.length,
		commit,
		branch,
		failedStep:
			outcome?.status === 'failed' ? steps[outcome.index].name : undefined,
		signal: interrupts.signal,
		dryRun: config.dryRun,
		uncheckedChanges:
			config.allowDirty && git(config.root, 'status', '--porcelain') !== '',
	})
	return exitCode
}
