import { Cron } from 'croner'
import pLimit from 'p-limit'
import { checkPermessoStatus } from './checker'
import { permessoRepository } from './repository'

const CHECK_CONCURRENCY = 2

async function runScheduledChecks() {
	const currentHour = new Date().getHours()
	const subscriptions = await permessoRepository.listAll()
	const due = subscriptions.filter((s) => s.checkHours.includes(currentHour))
	if (due.length === 0) return

	const limit = pLimit(CHECK_CONCURRENCY)

	await Promise.all(
		due.map((subscription) =>
			limit(async () => {
				const result = await checkPermessoStatus(subscription.practiceNumber)
				await permessoRepository.recordCheckResult(subscription.userId, result)
			}),
		),
	)
}

// Fires every hour on the hour (server local time) and checks only the
// subscriptions whose user-configured checkHours include the current hour —
// each user picks their own check times from the Permesso Status page.
export function schedulePermessoJobs() {
	new Cron('0 * * * *', runScheduledChecks)
}
