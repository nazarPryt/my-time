// Runs named steps with a live terminal step list (ci:local, observability:test):
// preflight checks, per-step logs, an ETA from the last run, interrupt handling
// and a closing summary box.
export { drawBox } from './box'
export { InterruptGuard, signalExitCode } from './interrupts'
export {
	createStates,
	type PipelineOutcome,
	runPipeline,
} from './pipeline'
export {
	checkBrowser,
	checkDocker,
	checkPlaywrightChromium,
	checkPorts,
	commandOutput,
	findBusyPorts,
	formatFailures,
	type PortUse,
	type PreflightFailure,
} from './preflight'
export {
	type Env,
	type Output,
	type OutputHandler,
	type OutputStream,
	ProcessRunner,
} from './process-runner'
export {
	fit,
	formatDuration,
	lastLine,
	paint,
	type StepState,
	type StepStatus,
	stripAnsi,
} from './progress'
export { readLogTail, resetLogDir, stepLogPath } from './step-logs'
export {
	cleanupTask,
	printSummaryBox,
	type RunResult,
	reportInterrupt,
	summaryRow,
} from './summary'
export { readTimings, type Timings, writeTimings } from './timings'
export { createTui } from './tui'
