import { Cron } from 'croner'
import { logger } from './logger'
import { jobDuration, jobLastSuccess, jobRunsTotal } from './metrics'

// Optional summary fields a job reports on its `job finished` line.
type JobSummary = Record<string, unknown> | undefined

/**
 * Runs a job once with logging and metrics. Never throws: a failure is logged
 * and counted, so one bad run can't become an unhandled rejection.
 */
export async function runJob(
	name: string,
	run: () => Promise<JobSummary | undefined> | JobSummary | undefined,
): Promise<void> {
	const start = performance.now()
	logger.debug({ job: name }, 'job started')
	try {
		const summary = await run()
		const durationMs = performance.now() - start
		jobRunsTotal.inc({ job: name, result: 'success' })
		jobDuration.observe({ job: name }, durationMs / 1000)
		jobLastSuccess.set({ job: name }, Date.now() / 1000)
		logger.info(
			{ job: name, durationMs: Math.round(durationMs), ...summary },
			'job finished',
		)
	} catch (error) {
		const durationMs = performance.now() - start
		jobRunsTotal.inc({ job: name, result: 'failure' })
		jobDuration.observe({ job: name }, durationMs / 1000)
		logger.error(
			{ job: name, durationMs: Math.round(durationMs), err: error },
			'job failed',
		)
	}
}

/** Schedules a named cron job; overlapping runs are skipped (`protect`). */
export function scheduleJob(
	name: string,
	pattern: string,
	run: () => Promise<JobSummary | undefined> | JobSummary | undefined,
): Cron {
	// "Last success" starts at boot so a fresh process doesn't look stale.
	jobLastSuccess.set({ job: name }, Date.now() / 1000)
	jobRunsTotal.inc({ job: name, result: 'success' }, 0)
	jobRunsTotal.inc({ job: name, result: 'failure' }, 0)
	return new Cron(
		pattern,
		{
			name,
			protect: () => logger.warn({ job: name }, 'job skipped: still running'),
		},
		() => runJob(name, run),
	)
}
