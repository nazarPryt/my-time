import { z } from 'zod'

export const UpdateCheckHoursRequestSchema = z.object({
	checkHours: z.array(z.number().int().min(0).max(23)).max(24),
})
export type UpdateCheckHoursRequest = z.infer<
	typeof UpdateCheckHoursRequestSchema
>
