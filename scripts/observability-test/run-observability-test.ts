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
import type { TestConfig } from './config'
import { countPanels } from './grafana/dashboards'
import { runPreflight } from './preflight'
import { reportFailure, reportSummary } from './report'
import { createStepRunner } from './step-runner'
import { buildSteps, createRunState } from './steps'

// preflight → run steps → report → clean up; resolves to the process exit code.
export async function runObservabilityTest(
	config: TestConfig,
): Promise<number> {
	const runner = new ProcessRunner(config.env)
	let cleaningUp = false
	const interrupts = new InterruptGuard(() => {
		if (!cleaningUp) runner.stop()
	})

	const failures = await runPreflight(config.root)
	if (interrupts.interrupted) return interrupts.exitCode(1)
	if (failures.length > 0) {
		console.error(
			formatFailures(failures, 'Observability test prerequisites not met'),
		)
		return 1
	}

	const run = createRunState()
	const steps = buildSteps(config, run)
	const states = createStates(steps)
	const timings = await readTimings(config.timingsFile)
	const logPath = (index: number) =>
		stepLogPath(config.logDir, index, steps[index].name)
	const startedAt = Date.now()
	const tui = config.plain
		? undefined
		: createTui({
				title:
					'my-time observability test · Grafana dashboards vs known traffic',
				states,
				timings,
				startedAt,
			})

	let outcome: PipelineOutcome | undefined
	try {
		await resetLogDir(config.logDir)
		tui?.start()
		outcome = await runPipeline({
			steps,
			states,
			timings,
			runStep: createStepRunner({
				runner,
				root: config.root,
				plain: config.plain,
				logPath,
				isInterrupted: () => interrupts.interrupted,
			}),
			isInterrupted: () => interrupts.interrupted,
		})
	} catch (error) {
		console.error(error instanceof Error ? error.message : error)
	} finally {
		cleaningUp = true
		tui?.stop()
		await writeTimings(config.timingsFile, timings)
	}

	const failedStep =
		outcome?.status === 'failed' ? steps[outcome.index].name : undefined
	if (outcome?.status === 'failed')
		await reportFailure(
			steps[outcome.index].name,
			config.plain ? undefined : logPath(outcome.index),
		)
	if (interrupts.signal) reportInterrupt(interrupts.signal)

	const succeeded = outcome?.status === 'passed' && !interrupts.interrupted
	const stackRemoved = await cleanUp({
		config,
		runner,
		stackStarted: states[0].status !== 'pending',
		interrupted: interrupts.interrupted,
	})

	const exitCode = interrupts.exitCode(succeeded && stackRemoved ? 0 : 1)
	const browserStep = states.at(-1)
	reportSummary({
		exitCode,
		elapsedMs: Date.now() - startedAt,
		stepCount: steps.length,
		panelCount: countPanels(run.dashboards),
		dashboardCount: run.dashboards.length,
		counts: run.counts,
		resultsDir: config.resultsDir,
		screenshotsTaken:
			browserStep?.status === 'passed' || browserStep?.status === 'failed',
		kept: config.keep && !interrupts.interrupted,
		failedStep,
		problemCount: failedStep ? run.problems.length : 0,
		signal: interrupts.signal,
	})
	return exitCode
}
