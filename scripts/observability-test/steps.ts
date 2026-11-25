import { mkdir, rm } from 'node:fs/promises'
import { composeCommand, type TestConfig } from './config'
import { screenshotDashboards } from './grafana/browser'
import { promValue } from './grafana/client'
import { type Dashboard, loadDashboards } from './grafana/dashboards'
import { checkPanels } from './panels/check-panels'
import type { StepContext, TestStep } from './step-runner'
import { type Counts, generateTraffic } from './traffic/traffic'

// Panels need two scrapes (30s apart) plus Loki ingestion to settle.
const SETTLE_TIMEOUT_MS = 180_000

/** What the steps hand to each other and to the final summary. */
export interface RunState {
	dashboards: Dashboard[]
	counts?: Counts
	problems: string[]
}

export function createRunState(): RunState {
	return { dashboards: loadDashboards(), problems: [] }
}

function failWith(context: StepContext, problems: string[], what: string) {
	for (const problem of problems) context.log(`- ${problem}`)
	throw new Error(`${problems.length} ${what}`)
}

export function buildSteps(config: TestConfig, run: RunState): TestStep[] {
	return [
		{
			name: 'Remove leftover test stack',
			run: (context) => context.run(composeCommand('down', '--volumes')),
		},
		{
			name: 'Build and start stack',
			run: (context) =>
				context.run(composeCommand('up', '-d', '--build', '--wait')),
		},
		{
			// Counting panels need a sample from before the first event.
			name: 'Wait for first scrapes',
			run: (context) =>
				context.poll(
					'two Prometheus scrapes of the API',
					async () => {
						const samples = await promValue(
							'count_over_time(auth_events_total{event="register"}[10m])',
						)
						context.log(`API samples in Prometheus: ${samples ?? 0}/2`)
						return (samples ?? 0) >= 2
					},
					{ timeoutMs: SETTLE_TIMEOUT_MS, everyMs: 5000 },
				),
		},
		{
			name: 'Send traffic',
			run: async (context) => {
				run.counts = await generateTraffic(context.log)
			},
		},
		{
			name: 'Check panel data',
			run: async (context) => {
				const counts = run.counts
				if (!counts) throw new Error('No traffic was sent')
				try {
					await context.poll(
						'every panel to show the expected data',
						async () => {
							run.problems = await checkPanels(run.dashboards, counts)
							context.log(
								run.problems.length
									? `${run.problems.length} panel(s) not right yet, waiting for scrapes…`
									: 'every panel shows the expected data',
							)
							return run.problems.length === 0
						},
						{ timeoutMs: SETTLE_TIMEOUT_MS, everyMs: 15_000 },
					)
				} catch (error) {
					if (run.problems.length === 0) throw error
					failWith(context, run.problems, 'panel problem(s)')
				}
			},
		},
		{
			name: 'Check dashboards in browser',
			run: async (context) => {
				await rm(config.resultsDir, { recursive: true, force: true })
				await mkdir(config.resultsDir, { recursive: true })
				const problems = await screenshotDashboards(
					run.dashboards,
					config.resultsDir,
					context.log,
				)
				run.problems.push(...problems)
				if (problems.length)
					failWith(context, problems, 'dashboard(s) render an error')
			},
		},
	]
}
