import type { ClientErrorReport } from '@my-time/contracts'

const DEDUPE_MS = 60_000
const MAX_REPORTS_PER_PAGE = 20

type Send = (report: ClientErrorReport) => void

/**
 * Wraps a sender so an error loop (e.g. a failing render on every frame)
 * sends each message once a minute and at most 20 reports per page load.
 */
export function createErrorReporter(send: Send, now = () => Date.now()) {
	const lastSent = new Map<string, number>()
	let sent = 0
	return (report: ClientErrorReport): boolean => {
		if (sent >= MAX_REPORTS_PER_PAGE) return false
		const previous = lastSent.get(report.message)
		if (previous !== undefined && now() - previous < DEDUPE_MS) return false
		lastSent.set(report.message, now())
		sent++
		send(report)
		return true
	}
}
