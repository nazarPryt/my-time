import { z } from 'zod'

export const CLIENT_ERROR_SOURCES = ['web', 'extension'] as const

// Bounded so a broken or hostile client can't flood the logs with huge lines.
export const ClientErrorReportSchema = z.object({
	source: z.enum(CLIENT_ERROR_SOURCES),
	message: z.string().min(1).max(1000),
	stack: z.string().max(8000).optional(),
	url: z.string().max(2000).optional(),
	appVersion: z.string().max(50).optional(),
})
export type ClientErrorReport = z.infer<typeof ClientErrorReportSchema>
