import { expect, test } from 'bun:test'
import { addDays, addMinutes, format, startOfDay, subMinutes } from 'date-fns'
import { groupCompletedWorkByDay } from './groupCompletedWorkByDay'
import { mergedWorkMilliseconds } from './merged-work'

test('nested and adjacent intervals merge, abandoned work is excluded, and days are clipped independently', () => {
	const midnight = startOfDay(new Date())
	const sessions = [
		{
			type: 'work' as const,
			startedAt: subMinutes(midnight, 20),
			endedAt: addMinutes(midnight, 20),
			abandonedAt: null,
		},
		{
			type: 'work' as const,
			startedAt: subMinutes(midnight, 10),
			endedAt: addMinutes(midnight, 10),
			abandonedAt: null,
		},
		{
			type: 'work' as const,
			startedAt: addMinutes(midnight, 20),
			endedAt: addMinutes(midnight, 30),
			abandonedAt: null,
		},
		{
			type: 'work' as const,
			startedAt: addMinutes(midnight, 30),
			endedAt: addMinutes(midnight, 50),
			abandonedAt: midnight,
		},
	]
	expect(mergedWorkMilliseconds(sessions)).toBe(50 * 60_000)
	const days = groupCompletedWorkByDay(sessions)
	expect(
		days.get(format(addDays(midnight, -1), 'yyyy-MM-dd'))?.totalWorkSeconds,
	).toBe(20 * 60)
	expect(days.get(format(midnight, 'yyyy-MM-dd'))?.totalWorkSeconds).toBe(
		30 * 60,
	)
})
