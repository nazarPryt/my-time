import { Cron } from 'croner'
import pLimit from 'p-limit'
import { checkPermessoStatus } from './checker'
import { permessoRepository } from './repository'
import { sendTelegramCheckResult } from './telegram-bot'

const CHECK_CONCURRENCY = 2

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

async function runScheduledChecks() {
	const now = new Date()
	const subscriptions = await permessoRepository.listAll()
	const due = subscriptions.filter((s) =>
		s.checkHours.includes(getHourInTimeZone(now, s.timezone)),
	)
	if (due.length === 0) return

	const limit = pLimit(CHECK_CONCURRENCY)

	await Promise.all(
		due.map((subscription) =>
			limit(async () => {
				const result = await checkPermessoStatus(subscription.practiceNumber)
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
			}),
		),
	)
}

// Fires every hour on the hour and checks only the subscriptions whose
// current local hour (per-subscription timezone) is in their checkHours —
// each user picks their own check times from the Permesso Status page.
export function schedulePermessoJobs() {
	new Cron('0 * * * *', runScheduledChecks)
}
