import { logger } from '@shared/logger'
import { permessoChecksTotal } from '@shared/metrics'
import { checkPermessoStatus } from './portal/checker'
import type { PermessoCheckResult } from './types'

export type CheckTrigger = 'scheduled' | 'manual'

/** Runs a portal check and records its outcome in logs and metrics. */
export async function checkPermessoWithTelemetry(
	userId: string,
	practiceNumber: string,
	trigger: CheckTrigger,
): Promise<PermessoCheckResult> {
	const start = performance.now()
	const result = await checkPermessoStatus(practiceNumber)
	const durationMs = Math.round(performance.now() - start)
	permessoChecksTotal.inc({
		trigger,
		result: result.success ? 'success' : 'failure',
	})
	if (result.success)
		logger.info({ userId, trigger, durationMs }, 'permesso check completed')
	else
		logger.warn(
			{ userId, trigger, durationMs, error: result.error },
			'permesso check failed',
		)
	return result
}
