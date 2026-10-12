import { z } from 'zod'

/** Fractional seconds preserve precision across short sessions and display ticks. */
export const TimerSnapshotSchema = z.object({
	asOf: z.coerce.date(),
	timeZone: z.string(),
	dayStartedAt: z.coerce.date(),
	nextDayAt: z.coerce.date(),
	dailyWorkSeconds: z.number().nonnegative(),
	sessionWorkSeconds: z.number().nonnegative(),
	running: z.boolean(),
})
export type TimerSnapshot = z.infer<typeof TimerSnapshotSchema>
