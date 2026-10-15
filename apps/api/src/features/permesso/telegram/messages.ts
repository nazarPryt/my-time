import type { PermessoCheckResult } from '../types'

// One of the six "quick reaction" message effects Telegram's Bot API supports
// via `message_effect_id` on sendMessage (private chats only) — node-telegram-bot-api
// doesn't expose these as an enum, so this is a fixed literal per Telegram's docs.
export const TELEGRAM_EFFECT_CONFETTI = '5046509860389126442'

export function formatCheckMessage(
	result: PermessoCheckResult,
	isReady: boolean,
): string {
	if (result.success) {
		if (isReady) {
			return `🎉 *Your permesso is ready!*\n\n📄 Status: ${result.status || 'No status available'}`
		}
		return `✅ *Permesso check complete*\n\n📄 Status: ${result.status || 'No status available'}`
	}
	return `❌ *Permesso check failed*\n\n⚠️ Error: ${result.error}`
}
