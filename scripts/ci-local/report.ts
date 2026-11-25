import {
	formatDuration,
	paint,
	printSummaryBox,
	readLogTail,
	type StepState,
	summaryRow,
} from '../shared/step-runner'
import type { Step } from './steps'

const FAILURE_TAIL_LINES = 60

export async function reportFailure(
	step: Step,
	state: StepState,
	logFile: string | undefined,
) {
	console.error(
		paint.red(
			`\n✗ ${step.name} failed (exit ${state.exitCode}): ${step.command.join(' ')}`,
		),
	)
	// Without a log file (plain mode) the output is already on screen.
	if (!logFile) return
	const tail = await readLogTail(logFile, FAILURE_TAIL_LINES)
	console.error(paint.dim(`── last ${tail.length} lines of ${logFile} ──`))
	console.error(tail.join('\n'))
}

export interface Summary {
	exitCode: number
	elapsedMs: number
	stepCount: number
	// Short hash and subject of the commit the steps checked.
	commit: string
	branch: string
	failedStep?: string
	signal?: NodeJS.Signals
	dryRun: boolean
	uncheckedChanges: boolean
}

function headline({ exitCode, stepCount, failedStep, signal }: Summary) {
	if (signal) return paint.yellow(`■ Local CI interrupted (${signal})`)
	if (failedStep) return paint.red(`✗ Local CI failed at ${failedStep}`)
	if (exitCode !== 0) return paint.red('✗ Local CI failed during cleanup')
	return paint.bold(paint.green(`✓ All ${stepCount} local CI steps passed`))
}

export function reportSummary(summary: Summary) {
	const passed = summary.exitCode === 0
	const label = (name: string, value: string) => summaryRow(name, value)
	const lines = [
		headline(summary),
		'',
		label('Commit', summary.commit),
		label('Branch', summary.branch || 'detached'),
		label('Time', formatDuration(summary.elapsedMs)),
	]
	if (passed) lines.push('', paint.bold(paint.green('🚀 Ready to deploy')))
	if (summary.uncheckedChanges) {
		lines.push(
			paint.yellow('⚠ --allow-dirty: uncommitted changes were not checked;'),
			paint.yellow('  commit and rerun before a PR.'),
		)
	}
	if (summary.dryRun) {
		lines.push(
			paint.yellow('⚠ Dry run: every step was skipped, nothing was checked.'),
		)
	}
	printSummaryBox(lines, {
		result: passed ? 'passed' : summary.signal ? 'interrupted' : 'failed',
		exitCode: summary.exitCode,
	})
}
