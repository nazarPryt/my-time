import { z } from 'zod'
import { GoalResponseSchema } from './goal'
import { SetResponseSchema } from './set'

export const TodayResponseSchema = z.object({
	sets: z.array(SetResponseSchema),
	goal: GoalResponseSchema,
	total: z.number(),
})
export type TodayResponse = z.infer<typeof TodayResponseSchema>
