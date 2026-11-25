import {
	formatDuration,
	paint,
	printSummaryBox,
	readLogTail,
	summaryRow,
} from '../shared/step-runner'
import { COMPOSE_PROJECT, GRAFANA_ADMIN, GRAFANA_URL } from './config'
import type { Counts } from './traffic/traffic'

const FAILURE_TAIL_LINES = 40

export async function reportFailure(stepName: string, logFile?: string) {
	console.error(paint.red(`\n✗ ${stepName} failed`))
	// Without a log file (--plain) the output is already on screen.
	if (!logFile) return
	const tail = await readLogTail(logFile, FAILURE_TAIL_LINES)
	console.error(paint.dim(`── last ${tail.length} lines of ${logFile} ──`))
	console.error(tail.join('\n'))
}

export interface Summary {
	exitCode: number
	elapsedMs: number
	stepCount: number
	panelCount: number
	dashboardCount: number
	counts?: Counts
	resultsDir: string
	screenshotsTaken: boolean
	kept: boolean
	failedStep?: string
	problemCount: number
	signal?: NodeJS.Signals
}

function headline({ exitCode, stepCount, failedStep, signal }: Summary) {
	if (signal)
		return paint.yellow(`■ Observability test interrupted (${signal})`)
	if (failedStep)
		return paint.red(`✗ Observability test failed at ${failedStep}`)
	if (exitCode !== 0)
		return paint.red('✗ Observability test failed during cleanup')
	return paint.bold(
		paint.green(`✓ All ${stepCount} observability test steps passed`),
	)
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

function describeTraffic(counts: Counts) {
	return [
		plural(counts.register, 'sign-up'),
		plural(counts.login, 'login'),
		plural(counts.loginFailed, 'failed login'),
		plural(counts.refreshFailed, 'refresh failure'),
		plural(counts.clientErrors, 'client error'),
	].join(' · ')
}

// The same boxed summary as ci:local, with what this run checked.
export function reportSummary(summary: Summary) {
	const passed = summary.exitCode === 0
	const label = (name: string, value: string) => summaryRow(name, value, 12)
	const lines = [
		headline(summary),
		'',
		label(
			'Panels',
			`${summary.panelCount} on ${summary.dashboardCount} dashboards`,
		),
	]
	if (summary.counts)
		lines.push(label('Traffic', describeTraffic(summary.counts)))
	if (summary.problemCount)
		lines.push(
			label('Problems', paint.red(`${summary.problemCount} (listed above)`)),
		)
	if (summary.screenshotsTaken)
		lines.push(label('Screenshots', summary.resultsDir))
	lines.push(label('Time', formatDuration(summary.elapsedMs)))
	if (summary.kept) {
		lines.push(
			'',
			label(
				'Grafana',
				`${GRAFANA_URL} (${GRAFANA_ADMIN.user}/${GRAFANA_ADMIN.password})`,
			),
			label('Stop with', `docker compose -p ${COMPOSE_PROJECT} down -v`),
		)
	}
	if (passed)
		lines.push(
			'',
			paint.bold(paint.green('📊 Every dashboard shows the right data')),
		)
	printSummaryBox(lines, {
		result: passed ? 'passed' : summary.signal ? 'interrupted' : 'failed',
		exitCode: summary.exitCode,
	})
}
