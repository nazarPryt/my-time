import { drawBox } from './box'
import { formatDuration, paint } from './progress'

export type RunResult = 'passed' | 'failed' | 'interrupted'

/** Prints a task line, runs it, then rewrites the line with ✓/✗ and its duration. */
export async function cleanupTask(label: string, task: () => Promise<boolean>) {
	const started = Date.now()
	process.stdout.write(`  ${label}…`)
	const ok = await task()
	const mark = ok ? paint.green('✓') : paint.red('✗')
	const took = paint.dim(formatDuration(Date.now() - started))
	const rewind = process.stdout.isTTY ? '\r\x1b[2K' : ' '
	process.stdout.write(`${rewind}${mark} ${label}  ${took}\n`)
	return ok
}

export function reportInterrupt(signal: NodeJS.Signals) {
	console.error(paint.yellow(`\n${signal} received; cleaning up…`))
}

/** A `name    value` row for the summary box. */
export function summaryRow(name: string, value: string, width = 8) {
	return `${paint.dim(name.padEnd(width))}${value}`
}

/** The closing box of a run, colored by its result, plus the exit code. */
export function printSummaryBox(
	lines: string[],
	{ result, exitCode }: { result: RunResult; exitCode: number },
) {
	const border =
		result === 'passed'
			? paint.green
			: result === 'interrupted'
				? paint.yellow
				: paint.red
	const box = drawBox(lines, {
		maxWidth: Math.min((process.stdout.columns ?? 80) - 1, 100),
		border,
	})
	console.info(`\n${box.join('\n')}`)
	console.info(paint.dim(`  Exit code ${exitCode}.`))
}
