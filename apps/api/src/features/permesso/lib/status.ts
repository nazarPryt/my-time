export function normalizePermessoStatus(status: string): string {
	return status
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.replace(/\s+/g, ' ')
		.trim()
}

export function isPermessoReady(status: string): boolean {
	const normalized = normalizePermessoStatus(status)
	// Be conservative: unfamiliar wording remains a normal status notification.
	if (/\bnon\b/.test(normalized)) return false
	return /\bpronto\s+per\s+la\s+consegna\b/.test(normalized)
}
