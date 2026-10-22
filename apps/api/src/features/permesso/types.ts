import type { CheckResultResponse, TelegramLinkResponse } from 'contracts'
import type { PERMESSO_FAILURE_REASONS } from './constants'

export type PermessoCheckResult =
	| { success: true; status: string }
	| { success: false; error: string }

export type RunCheckResult =
	| { ok: true; result: CheckResultResponse }
	| { ok: false; reason: typeof PERMESSO_FAILURE_REASONS.noPracticeNumber }

export type TelegramLinkResult =
	| { ok: true; link: TelegramLinkResponse }
	| {
			ok: false
			reason:
				| typeof PERMESSO_FAILURE_REASONS.noPracticeNumber
				| typeof PERMESSO_FAILURE_REASONS.botNotConfigured
	  }

export type TelegramLinkEvent =
	| { event: 'connected' }
	| { event: 'open' }
	| { event: 'ping' }
	| { event: 'timeout' }
