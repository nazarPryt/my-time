import type {
	PermessoCheckHistoryResponse,
	PermessoStatusResponse,
} from 'contracts'
import {
	PERMESSO_FAILURE_REASONS,
	TELEGRAM_LINK_HEARTBEAT_MS,
	TELEGRAM_LINK_TIMEOUT_MS,
} from './constants'
import { checkPermessoStatus } from './portal/checker'
import { permessoRepository } from './repository'
import {
	buildTelegramDeepLink,
	sendTelegramCheckResult,
	sendTelegramUnsubscribedNotice,
} from './telegram/bot'
import { waitForTelegramLinkOrHeartbeat } from './telegram/link-events'
import type {
	RunCheckResult,
	TelegramLinkEvent,
	TelegramLinkResult,
} from './types'

function toStatusResponse(
	row: Awaited<ReturnType<typeof permessoRepository.getByUserId>> | null,
): PermessoStatusResponse {
	return {
		practiceNumber: row?.practiceNumber ?? null,
		checkHours: row?.checkHours ?? [],
		lastStatus: row?.lastStatus ?? null,
		lastCheckedAt: row?.lastCheckedAt?.toISOString() ?? null,
		lastError: row?.lastError ?? null,
		telegramConnected: !!row?.telegramChatId,
	}
}

export const permessoService = {
	getStatus: async (userId: string): Promise<PermessoStatusResponse> => {
		const row = await permessoRepository.getByUserId(userId)
		return toStatusResponse(row)
	},

	setPracticeNumber: async (
		userId: string,
		practiceNumber: string,
	): Promise<PermessoStatusResponse> => {
		const row = await permessoRepository.upsertPracticeNumber(
			userId,
			practiceNumber,
		)
		return toStatusResponse(row)
	},

	updateCheckHours: async (
		userId: string,
		checkHours: number[],
		timezone: string,
	): Promise<PermessoStatusResponse> => {
		const unique = [...new Set(checkHours)].sort((a, b) => a - b)
		const row = await permessoRepository.updateCheckHours(
			userId,
			unique,
			timezone,
		)
		return toStatusResponse(row)
	},

	runCheck: async (userId: string): Promise<RunCheckResult> => {
		const row = await permessoRepository.getByUserId(userId)
		if (!row)
			return { ok: false, reason: PERMESSO_FAILURE_REASONS.noPracticeNumber }

		const outcome = await checkPermessoStatus(row.practiceNumber)
		await permessoRepository.recordCheckResult(userId, outcome, 'manual')

		if (row.telegramChatId) {
			await sendTelegramCheckResult(userId, row.telegramChatId, outcome)
		}

		return {
			ok: true,
			result: {
				success: outcome.success,
				status: outcome.success ? outcome.status : null,
				error: outcome.success ? null : outcome.error,
				checkedAt: new Date().toISOString(),
			},
		}
	},

	createTelegramLink: async (userId: string): Promise<TelegramLinkResult> => {
		const row = await permessoRepository.getByUserId(userId)
		if (!row)
			return { ok: false, reason: PERMESSO_FAILURE_REASONS.noPracticeNumber }

		const linkToken = crypto.randomUUID()
		await permessoRepository.setTelegramLinkToken(userId, linkToken)

		const deepLink = buildTelegramDeepLink(linkToken)
		if (!deepLink)
			return { ok: false, reason: PERMESSO_FAILURE_REASONS.botNotConfigured }

		return { ok: true, link: { deepLink } }
	},

	disconnectTelegram: async (
		userId: string,
	): Promise<PermessoStatusResponse> => {
		const row = await permessoRepository.disconnectTelegram(userId)
		return toStatusResponse(row)
	},

	resetAll: async (userId: string): Promise<PermessoStatusResponse> => {
		const row = await permessoRepository.getByUserId(userId)
		if (row?.telegramChatId) {
			await sendTelegramUnsubscribedNotice(row.telegramChatId)
		}
		await permessoRepository.deleteAllForUser(userId)
		return toStatusResponse(null)
	},

	getHistory: async (userId: string): Promise<PermessoCheckHistoryResponse> => {
		const rows = await permessoRepository.listHistory(userId)
		return rows.map((row) => ({
			id: row.id,
			success: row.success,
			status: row.status,
			error: row.error,
			triggeredBy: row.triggeredBy,
			checkedAt: row.checkedAt.toISOString(),
		}))
	},

	/**
	 * Yields 'connected' immediately if a Telegram chat is already linked;
	 * otherwise polls (via Postgres LISTEN/NOTIFY, see telegram/link-events.ts)
	 * until it links or TELEGRAM_LINK_TIMEOUT_MS elapses, yielding 'ping' on
	 * every heartbeat in between so the route can keep the SSE connection alive.
	 */
	streamTelegramLinkEvents: async function* (
		userId: string,
		{
			timeoutMs = TELEGRAM_LINK_TIMEOUT_MS,
			heartbeatMs = TELEGRAM_LINK_HEARTBEAT_MS,
		}: { timeoutMs?: number; heartbeatMs?: number } = {},
	): AsyncGenerator<TelegramLinkEvent> {
		const row = await permessoRepository.getByUserId(userId)
		if (row?.telegramChatId) {
			yield { event: 'connected' }
			return
		}

		// Flush headers immediately — otherwise nothing (not even the response
		// headers) reaches the client until the first heartbeat.
		yield { event: 'open' }

		const deadline = Date.now() + timeoutMs
		while (Date.now() < deadline) {
			const outcome = await waitForTelegramLinkOrHeartbeat(
				userId,
				Math.min(heartbeatMs, deadline - Date.now()),
			)
			if (outcome === 'linked') {
				yield { event: 'connected' }
				return
			}
			yield { event: 'ping' }
		}

		yield { event: 'timeout' }
	},
}
