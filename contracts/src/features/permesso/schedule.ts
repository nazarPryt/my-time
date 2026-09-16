import { z } from 'zod'

function isValidTimeZone(timezone: string) {
	try {
		new Intl.DateTimeFormat('en-US', { timeZone: timezone })
		return true
	} catch {
		return false
	}
}

export const UpdateCheckHoursRequestSchema = z.object({
	checkHours: z.array(z.number().int().min(0).max(23)).max(24),
	timezone: z
		.string()
		.min(1)
		.max(100)
		.refine(isValidTimeZone, 'Invalid IANA timezone'),
})
export type UpdateCheckHoursRequest = z.infer<
	typeof UpdateCheckHoursRequestSchema
>
