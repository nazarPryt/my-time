import type {
	CheckResultResponse,
	PermessoCheckHistoryResponse,
	PermessoStatusResponse,
	TelegramLinkResponse,
} from 'contracts'
import { checkPermessoStatus } from './checker'
import { permessoRepository } from './repository'
import { buildTelegramDeepLink, sendTelegramCheckResult } from './telegram-bot'

export type RunCheckResult =
	| { ok: true; result: CheckResultResponse }
	| { ok: false; reason: 'no_practice_number' }

export type TelegramLinkResult =
	| { ok: true; link: TelegramLinkResponse }
	| { ok: false; reason: 'no_practice_number' | 'bot_not_configured' }

function toStatusResponse(
	row: Awaited<ReturnType<typeof permessoRepository.getByUserId>>,
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
	): Promise<PermessoStatusResponse> => {
		const unique = [...new Set(checkHours)].sort((a, b) => a - b)
		const row = await permessoRepository.updateCheckHours(userId, unique)
		return toStatusResponse(row)
	},

	runCheck: async (userId: string): Promise<RunCheckResult> => {
		const row = await permessoRepository.getByUserId(userId)
		if (!row) return { ok: false, reason: 'no_practice_number' }

		const outcome = await checkPermessoStatus(row.practiceNumber)
		await permessoRepository.recordCheckResult(userId, outcome)

		if (row.telegramChatId) {
			await sendTelegramCheckResult(row.telegramChatId, outcome)
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
		if (!row) return { ok: false, reason: 'no_practice_number' }

		const linkToken = crypto.randomUUID()
		await permessoRepository.setTelegramLinkToken(userId, linkToken)

		const deepLink = buildTelegramDeepLink(linkToken)
		if (!deepLink) return { ok: false, reason: 'bot_not_configured' }

		return { ok: true, link: { deepLink } }
	},

	disconnectTelegram: async (
		userId: string,
	): Promise<PermessoStatusResponse> => {
		const row = await permessoRepository.disconnectTelegram(userId)
		return toStatusResponse(row)
	},

	getHistory: async (userId: string): Promise<PermessoCheckHistoryResponse> => {
		const rows = await permessoRepository.listHistory(userId)
		return rows.map((row) => ({
			id: row.id,
			success: row.success,
			status: row.status,
			error: row.error,
			checkedAt: row.checkedAt.toISOString(),
		}))
	},
}
