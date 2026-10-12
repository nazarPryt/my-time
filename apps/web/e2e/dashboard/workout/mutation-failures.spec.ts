import { expect, test } from './workout.fixtures'
import {
	API_WORKOUT_CLEAR_SETS,
	API_WORKOUT_GOAL,
	API_WORKOUT_SET_BY_ID,
	API_WORKOUT_SETS,
	holdFailedWorkoutMutation,
	MOCK_SET_1,
	MOCK_TODAY_EMPTY,
	mockWorkoutMutation,
	mockWorkoutToday,
} from './workout.mocks'

test.describe('Workout mutation recovery', () => {
	test('failed quick-add rolls back optimistic total and can be retried', async ({
		page,
		workoutPage,
	}) => {
		const release = await holdFailedWorkoutMutation(
			page,
			API_WORKOUT_SETS,
			'POST',
		)
		await workoutPage.goto()
		await workoutPage.quickAdd(10)
		await expect(workoutPage.totalReps).toHaveText('35')
		await expect(workoutPage.setRows).toHaveCount(3)
		release()
		await expect(workoutPage.quickAddBtn(10)).toBeEnabled()
		await expect(workoutPage.totalReps).toHaveText('25')
		await expect(workoutPage.setRows).toHaveCount(2)
		await mockWorkoutMutation(page, API_WORKOUT_SETS, 'POST', {
			...MOCK_SET_1,
			id: 'retry-set',
		})
		await workoutPage.quickAdd(10)
		await expect(workoutPage.quickAddBtn(10)).toBeEnabled()
		await expect(workoutPage.totalReps).toHaveText('35')
		await expect(workoutPage.setRows).toHaveCount(3)
	})
	test('failed delete restores the set and total before retry', async ({
		page,
		workoutPage,
	}) => {
		const release = await holdFailedWorkoutMutation(
			page,
			API_WORKOUT_SET_BY_ID,
			'DELETE',
		)
		await workoutPage.goto()
		await workoutPage.deleteFirstSet()
		await expect(workoutPage.totalReps).toHaveText('10')
		await expect(workoutPage.setRows).toHaveCount(1)
		release()
		await expect(workoutPage.quickAddBtn(10)).toBeEnabled()
		await expect(workoutPage.totalReps).toHaveText('25')
		await expect(workoutPage.setRows).toHaveCount(2)
		await mockWorkoutMutation(page, API_WORKOUT_SET_BY_ID, 'DELETE')
		await workoutPage.deleteFirstSet()
		await expect(workoutPage.quickAddBtn(10)).toBeEnabled()
		await expect(workoutPage.totalReps).toHaveText('10')
		await expect(workoutPage.setRows).toHaveCount(1)
	})
	test('failed reset reloads saved sets and a retry clears the day', async ({
		page,
		workoutPage,
	}) => {
		await mockWorkoutMutation(
			page,
			API_WORKOUT_CLEAR_SETS,
			'DELETE',
			{ message: 'Unavailable' },
			503,
		)
		await workoutPage.goto()
		const failed = page.waitForResponse(
			(response) =>
				response.request().method() === 'DELETE' && response.status() === 503,
		)
		await workoutPage.resetDay()
		await failed
		await expect(workoutPage.totalReps).toHaveText('25')
		await expect(workoutPage.setRows).toHaveCount(2)
		await mockWorkoutMutation(page, API_WORKOUT_CLEAR_SETS, 'DELETE')
		await mockWorkoutToday(page, MOCK_TODAY_EMPTY)
		await workoutPage.resetDay()
		await expect(workoutPage.totalReps).toHaveText('0')
		await expect(workoutPage.setsLogEmpty).toBeVisible()
	})
	test('failed goal update restores the saved target and allows retry', async ({
		page,
		workoutPage,
	}) => {
		const release = await holdFailedWorkoutMutation(
			page,
			API_WORKOUT_GOAL,
			'PUT',
		)
		await workoutPage.goto()
		await workoutPage.setGoal(200)
		await expect(workoutPage.goalDisplayBtn).toContainText('200')
		release()
		await expect(workoutPage.goalDisplayBtn).toContainText('100')
		await mockWorkoutMutation(page, API_WORKOUT_GOAL, 'PUT', {
			exerciseType: 'pushups',
			targetReps: 200,
		})
		await workoutPage.setGoal(200)
		await expect(workoutPage.goalDisplayBtn).toContainText('200')
	})
})
