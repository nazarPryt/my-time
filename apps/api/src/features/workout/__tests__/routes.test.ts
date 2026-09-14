import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { treaty } from '@elysiajs/eden'
import {
	GoalResponseSchema,
	ProgressResponseSchema,
	SetResponseSchema,
	TodayResponseSchema,
} from 'contracts'
import { app } from '@/app'
import { cleanDatabase, runMigrations } from '@/test/setup'
import {
	authHeaders,
	OTHER_USER,
	registerAndGetToken,
	VALID_USER,
} from './fixtures'

// See fixtures.ts for why this isn't shared from there — Eden's inferred
// client type isn't nameable across files in this composite project (TS2883).
const api = treaty(app, { parseDate: false }).api.v1

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})

afterEach(async () => {
	await cleanDatabase()
})

describe('GET /workout/today', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api.workout.today.get({
			query: { exerciseType: 'pushups' },
		})
		expect(status).toBe(401)
	})

	it('returns an empty summary with the default goal for a fresh user', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api.workout.today.get({
			query: { exerciseType: 'pushups' },
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const parsed = TodayResponseSchema.parse(data)
		expect(parsed.sets).toEqual([])
		expect(parsed.total).toBe(0)
		expect(parsed.goal).toEqual({ exerciseType: 'pushups', targetReps: 100 })
	})

	it('defaults exerciseType to pushups when the query param is omitted', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		await api.workout.sets.post(
			{ exerciseType: 'pushups', reps: 20 },
			{ headers: authHeaders(token) },
		)

		const { data, status } = await api.workout.today.get({
			// @ts-expect-error — intentionally omitting exerciseType to exercise the default
			query: {},
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const parsed = TodayResponseSchema.parse(data)
		expect(parsed.total).toBe(20)
	})

	it('reflects sets added earlier in the total', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		await api.workout.sets.post(
			{ exerciseType: 'pushups', reps: 10 },
			{ headers: authHeaders(token) },
		)
		await api.workout.sets.post(
			{ exerciseType: 'pushups', reps: 15 },
			{ headers: authHeaders(token) },
		)

		const { data } = await api.workout.today.get({
			query: { exerciseType: 'pushups' },
			headers: authHeaders(token),
		})
		const parsed = TodayResponseSchema.parse(data)
		expect(parsed.sets).toHaveLength(2)
		expect(parsed.total).toBe(25)
	})

	it("is isolated per user's own sets", async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { token: otherToken } = await registerAndGetToken(OTHER_USER)
		await api.workout.sets.post(
			{ exerciseType: 'pushups', reps: 40 },
			{ headers: authHeaders(otherToken) },
		)

		const { data } = await api.workout.today.get({
			query: { exerciseType: 'pushups' },
			headers: authHeaders(token),
		})
		const parsed = TodayResponseSchema.parse(data)
		expect(parsed.sets).toEqual([])
		expect(parsed.total).toBe(0)
	})
})

describe('POST /workout/sets', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api.workout.sets.post({
			exerciseType: 'pushups',
			reps: 10,
		})
		expect(status).toBe(401)
	})

	it('returns 200 with the created set on success', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api.workout.sets.post(
			{ exerciseType: 'pushups', reps: 12 },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(200)
		const parsed = SetResponseSchema.parse(data)
		expect(parsed.exerciseType).toBe('pushups')
		expect(parsed.reps).toBe(12)
		expect(parsed.id).toBeTruthy()
		expect(parsed.createdAt).toBeTruthy()
	})

	it('defaults exerciseType to pushups when omitted from the body', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api.workout.sets.post(
			// @ts-expect-error — intentionally omitting exerciseType to exercise the default
			{ reps: 8 },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(200)
		const parsed = SetResponseSchema.parse(data)
		expect(parsed.exerciseType).toBe('pushups')
	})

	it('returns 422 when reps is missing', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api.workout.sets.post(
			// @ts-expect-error — intentional missing field
			{ exerciseType: 'pushups' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(422)
	})

	it('returns 422 when reps is zero or negative', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api.workout.sets.post(
			{ exerciseType: 'pushups', reps: 0 },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(422)
	})

	it('returns 422 for an unsupported exerciseType', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api.workout.sets.post(
			// @ts-expect-error — intentional invalid enum value
			{ exerciseType: 'squats', reps: 10 },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(422)
	})
})

describe('DELETE /workout/sets/:id', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api.workout.sets({ id: 'non-existent' }).delete()
		expect(status).toBe(401)
	})

	it('deletes an existing set belonging to the authenticated user', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data: created } = await api.workout.sets.post(
			{ exerciseType: 'pushups', reps: 10 },
			{ headers: authHeaders(token) },
		)
		const set = SetResponseSchema.parse(created)

		const { status } = await api.workout
			.sets({ id: set.id })
			.delete(undefined, { headers: authHeaders(token) })
		expect(status).toBe(200)

		const { data: todayData } = await api.workout.today.get({
			query: { exerciseType: 'pushups' },
			headers: authHeaders(token),
		})
		expect(TodayResponseSchema.parse(todayData).sets).toEqual([])
	})

	it('does not delete another user’s set (scoped by userId)', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { token: otherToken } = await registerAndGetToken(OTHER_USER)
		const { data: created } = await api.workout.sets.post(
			{ exerciseType: 'pushups', reps: 10 },
			{ headers: authHeaders(token) },
		)
		const set = SetResponseSchema.parse(created)

		const { status } = await api.workout
			.sets({ id: set.id })
			.delete(undefined, { headers: authHeaders(otherToken) })
		// The route does not distinguish "not found" from "not yours" — it is a
		// scoped no-op either way, and still returns 200.
		expect(status).toBe(200)

		const { data: todayData } = await api.workout.today.get({
			query: { exerciseType: 'pushups' },
			headers: authHeaders(token),
		})
		expect(TodayResponseSchema.parse(todayData).sets).toHaveLength(1)
	})

	it('is a no-op that still returns 200 for a non-existent id', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api.workout
			.sets({ id: '00000000-0000-0000-0000-000000000000' })
			.delete(undefined, { headers: authHeaders(token) })
		expect(status).toBe(200)
	})
})

describe('DELETE /workout/sets', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api.workout.sets.delete(
			{},
			{ query: { exerciseType: 'pushups' } },
		)
		expect(status).toBe(401)
	})

	it("resets today's sets for the given exerciseType", async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		await api.workout.sets.post(
			{ exerciseType: 'pushups', reps: 10 },
			{ headers: authHeaders(token) },
		)
		await api.workout.sets.post(
			{ exerciseType: 'pushups', reps: 15 },
			{ headers: authHeaders(token) },
		)

		const { status } = await api.workout.sets.delete(
			{},
			{ query: { exerciseType: 'pushups' }, headers: authHeaders(token) },
		)
		expect(status).toBe(200)

		const { data: todayData } = await api.workout.today.get({
			query: { exerciseType: 'pushups' },
			headers: authHeaders(token),
		})
		const parsed = TodayResponseSchema.parse(todayData)
		expect(parsed.sets).toEqual([])
		expect(parsed.total).toBe(0)
	})

	it('defaults exerciseType to pushups when the query param is omitted', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		await api.workout.sets.post(
			{ exerciseType: 'pushups', reps: 10 },
			{ headers: authHeaders(token) },
		)

		const { status } = await api.workout.sets.delete(
			{},
			// @ts-expect-error — intentionally omitting exerciseType to exercise the default
			{ query: {}, headers: authHeaders(token) },
		)
		expect(status).toBe(200)

		const { data: todayData } = await api.workout.today.get({
			query: { exerciseType: 'pushups' },
			headers: authHeaders(token),
		})
		expect(TodayResponseSchema.parse(todayData).sets).toEqual([])
	})

	it('does not clear another user’s sets', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { token: otherToken } = await registerAndGetToken(OTHER_USER)
		await api.workout.sets.post(
			{ exerciseType: 'pushups', reps: 10 },
			{ headers: authHeaders(otherToken) },
		)

		await api.workout.sets.delete(
			{},
			{ query: { exerciseType: 'pushups' }, headers: authHeaders(token) },
		)

		const { data: todayData } = await api.workout.today.get({
			query: { exerciseType: 'pushups' },
			headers: authHeaders(otherToken),
		})
		expect(TodayResponseSchema.parse(todayData).sets).toHaveLength(1)
	})
})

describe('PUT /workout/goal', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await api.workout.goal.put({
			exerciseType: 'pushups',
			targetReps: 50,
		})
		expect(status).toBe(401)
	})

	it('returns 200 with the created goal on success', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api.workout.goal.put(
			{ exerciseType: 'pushups', targetReps: 60 },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(200)
		const parsed = GoalResponseSchema.parse(data)
		expect(parsed).toEqual({ exerciseType: 'pushups', targetReps: 60 })
	})

	it('overwrites an existing goal for the same exerciseType', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		await api.workout.goal.put(
			{ exerciseType: 'pushups', targetReps: 60 },
			{ headers: authHeaders(token) },
		)
		const { data, status } = await api.workout.goal.put(
			{ exerciseType: 'pushups', targetReps: 90 },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(200)
		expect(GoalResponseSchema.parse(data)).toEqual({
			exerciseType: 'pushups',
			targetReps: 90,
		})
	})

	it('defaults exerciseType to pushups when omitted from the body', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api.workout.goal.put(
			// @ts-expect-error — intentionally omitting exerciseType to exercise the default
			{ targetReps: 45 },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(200)
		expect(GoalResponseSchema.parse(data).exerciseType).toBe('pushups')
	})

	it('returns 422 when targetReps is missing', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api.workout.goal.put(
			// @ts-expect-error — intentional missing field
			{ exerciseType: 'pushups' },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(422)
	})

	it('returns 422 when targetReps is zero or negative', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api.workout.goal.put(
			{ exerciseType: 'pushups', targetReps: -5 },
			{ headers: authHeaders(token) },
		)
		expect(status).toBe(422)
	})
})

describe('GET /workout/progress', () => {
	it('returns 401 when unauthenticated', async () => {
		const now = new Date()
		const { status } = await api.workout.progress.get({
			query: {
				exerciseType: 'pushups',
				year: now.getFullYear(),
				month: now.getMonth() + 1,
			},
		})
		expect(status).toBe(401)
	})

	it('returns every day of the requested month with zero totals for a fresh user', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api.workout.progress.get({
			query: { exerciseType: 'pushups', year: 2024, month: 2 },
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const parsed = ProgressResponseSchema.parse(data)
		expect(parsed.days).toHaveLength(29)
		expect(parsed.days.every((d) => d.total === 0)).toBe(true)
		expect(parsed.goal).toEqual({ exerciseType: 'pushups', targetReps: 100 })
	})

	it('defaults exerciseType to pushups when the query param is omitted', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { data, status } = await api.workout.progress.get({
			// @ts-expect-error — intentionally omitting exerciseType to exercise the default
			query: { year: 2024, month: 2 },
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		expect(ProgressResponseSchema.parse(data).goal.exerciseType).toBe('pushups')
	})

	it('reflects sets added today in the current month’s progress', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		await api.workout.sets.post(
			{ exerciseType: 'pushups', reps: 20 },
			{ headers: authHeaders(token) },
		)
		const now = new Date()

		const { data, status } = await api.workout.progress.get({
			query: {
				exerciseType: 'pushups',
				year: now.getFullYear(),
				month: now.getMonth() + 1,
			},
			headers: authHeaders(token),
		})
		expect(status).toBe(200)
		const parsed = ProgressResponseSchema.parse(data)
		const total = parsed.days.reduce((sum, d) => sum + d.total, 0)
		expect(total).toBe(20)
	})

	it('returns 422 for a missing year or month', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api.workout.progress.get({
			// @ts-expect-error — intentional missing required field
			query: { month: 5 },
			headers: authHeaders(token),
		})
		expect(status).toBe(422)
	})

	it('returns 422 for an out-of-range month', async () => {
		const { token } = await registerAndGetToken(VALID_USER)
		const { status } = await api.workout.progress.get({
			query: { exerciseType: 'pushups', year: 2024, month: 13 },
			headers: authHeaders(token),
		})
		expect(status).toBe(422)
	})
})
