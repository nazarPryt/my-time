import { describe, expect, it } from 'bun:test'
import { runJob } from '../jobs'
import { metricsRegistry } from '../metrics'

async function metricValue(name: string, labels: Record<string, string>) {
	const metric = await metricsRegistry.getSingleMetric(name)?.get()
	return (
		metric?.values.find((v) =>
			Object.entries(labels).every(([k, value]) => v.labels[k] === value),
		)?.value ?? 0
	)
}

describe('runJob', () => {
	it('counts a success and records when it happened', async () => {
		const before = await metricValue('job_runs_total', {
			job: 'test.ok',
			result: 'success',
		})
		await runJob('test.ok', () => ({ processed: 3 }))
		expect(
			await metricValue('job_runs_total', {
				job: 'test.ok',
				result: 'success',
			}),
		).toBe(before + 1)
		const lastSuccess = await metricValue(
			'job_last_success_timestamp_seconds',
			{ job: 'test.ok' },
		)
		expect(Date.now() / 1000 - lastSuccess).toBeLessThan(5)
	})

	it('swallows and counts a failure instead of rejecting', async () => {
		await expect(
			runJob('test.broken', async () => {
				throw new Error('boom')
			}),
		).resolves.toBeUndefined()
		expect(
			await metricValue('job_runs_total', {
				job: 'test.broken',
				result: 'failure',
			}),
		).toBe(1)
	})
})
