import { scheduleJob } from '@shared/jobs'
import pLimit from 'p-limit'
import { checkPermessoWithTelemetry } from './check-telemetry'
import { CHECK_CONCURRENCY, CHECK_CRON_SCHEDULE } from './constants'
import { permessoRepository } from './repository'
import { sendTelegramCheckResult } from './telegram/bot'

export function getHourInTimeZone(date: Date, timeZone: string): number {
	try {
		return Number(
			new Intl.DateTimeFormat('en-US', {
				timeZone,
				hour: 'numeric',
				hourCycle: 'h23',
			}).format(date),
		)
	} catch {
		return date.getUTCHours()
	}
}

export async function runScheduledChecks() {
	const now = new Date()
	const subscriptions = await permessoRepository.listAll()
	const due = subscriptions.filter((s) =>
		s.checkHours.includes(getHourInTimeZone(now, s.timezone)),
	)
	if (due.length === 0) return { due: 0, succeeded: 0, failed: 0 }

	const limit = pLimit(CHECK_CONCURRENCY)

	const outcomes = await Promise.all(
		due.map((subscription) =>
			limit(async () => {
				const result = await checkPermessoWithTelemetry(
					subscription.userId,
					subscription.practiceNumber,
					'scheduled',
				)
				await permessoRepository.recordCheckResult(
					subscription.userId,
					result,
					'scheduled',
				)
				if (subscription.telegramChatId) {
					await sendTelegramCheckResult(
						subscription.userId,
						subscription.telegramChatId,
						result,
					)
				}
				return result.success
			}),
		),
	)
	const succeeded = outcomes.filter(Boolean).length
	return { due: due.length, succeeded, failed: due.length - succeeded }
}

export const PERMESSO_CHECKS_JOB = 'permesso.scheduled-checks'

// Fires every hour on the hour and checks only the subscriptions whose
// current local hour (per-subscription timezone) is in their checkHours —
// each user picks their own check times from the Permesso Status page.
export function schedulePermessoJobs() {
	scheduleJob(PERMESSO_CHECKS_JOB, CHECK_CRON_SCHEDULE, runScheduledChecks)
}
