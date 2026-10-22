export const PORTAL_SELECTORS = {
	practiceNumber: '#pratica',
	submit: '#invia',
	result: '.m-ok',
} as const

export const PORTAL_TIMEOUTS = {
	formMs: 10_000,
	navigationMs: 30_000,
	resultMs: 15_000,
} as const
