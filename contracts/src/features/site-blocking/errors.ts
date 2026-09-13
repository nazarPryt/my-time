import { z } from 'zod'

export const SITE_BLOCKING_ERRORS = {
	INVALID_DOMAIN: {
		code: 'INVALID_DOMAIN',
		message: 'Invalid domain',
	},
	DOMAIN_ALREADY_BLOCKED: {
		code: 'DOMAIN_ALREADY_BLOCKED',
		message: 'Domain already blocked',
	},
} as const

export type SiteBlockingErrorCode = keyof typeof SITE_BLOCKING_ERRORS

const entries = Object.values(SITE_BLOCKING_ERRORS)

export const SiteBlockingErrorSchema = z.object({
	code: z.enum(entries.map((e) => e.code)),
	message: z.enum(entries.map((e) => e.message)),
})
export type SiteBlockingError = z.infer<typeof SiteBlockingErrorSchema>
