import type { ClientErrorReport } from '@my-time/contracts'
import { logger } from '@shared/logger'
import { clientErrorsTotal } from '@shared/metrics'
import { createRateLimiter } from './rate-limit'

// The endpoint is public (errors happen before login too), so cap it.
const allow = createRateLimiter(30, 600)

export const clientErrorsService = {
	/** Returns false when the caller is over its rate limit. */
	report(
		report: ClientErrorReport,
		meta: { clientKey: string; userAgent?: string; userId?: string },
	): boolean {
		if (!allow(meta.clientKey)) return false
		clientErrorsTotal.inc({ source: report.source })
		logger.warn(
			{ ...report, userAgent: meta.userAgent, userId: meta.userId },
			'client error reported',
		)
		return true
	},
}
