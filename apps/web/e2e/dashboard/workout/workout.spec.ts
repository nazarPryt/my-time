import { AUTH_ERRORS } from 'contracts'
import { API_ME } from '../../support/auth.mocks'
import { WORKOUT_PATH } from './WorkoutPage'
import { expect, test } from './workout.fixtures'
import {
	API_WORKOUT_GOAL,
	API_WORKOUT_SET_BY_ID,
	API_WORKOUT_SETS,
	API_WORKOUT_TODAY,
	MOCK_TODAY_EMPTY,
	mockWorkoutToday,
} from './workout.mocks'

const LOGIN_PATH = '/auth/login'

test.describe('Workout page', () => {
	// ─── Page Load ──────────────────────────────────────────────────────────────

	test.describe('Initial load', () => {
		test.beforeEach(async ({ workoutPage }) => {
			await workoutPage.goto()
		})

		test('shows the workout header', async ({ workoutPage }) => {
			await expect(workoutPage.header).toBeVisible()
			await expect(workoutPage.header).toContainText('Workout')
		})

		test("shows today's date in the header", async ({ workoutPage }) => {
			await expect(workoutPage.dateLabel).toBeVisible()
			// date-fns formats as "EEEE, MMMM d" e.g. "Monday, April 14"
			await expect(workoutPage.dateLabel).toHaveText(
				/[A-Z][a-z]+, [A-Z][a-z]+ \d+/,
			)
		})

		test('shows total reps from API response', async ({ workoutPage }) => {
			await expect(workoutPage.totalReps).toHaveText('25')
		})

		test('shows progress bar', async ({ workoutPage }) => {
			await expect(workoutPage.progressBarFill).toBeVisible()
		})

		test('shows reps remaining toward goal', async ({ workoutPage }) => {
			await expect(workoutPage.repsLeft).toHaveText('75 left')
		})

		test('shows current goal on the goal button', async ({ workoutPage }) => {
			await expect(workoutPage.goalDisplayBtn).toContainText('100')
		})

		test('shows all four quick-add buttons', async ({ workoutPage }) => {
			for (const n of [5, 10, 15, 20]) {
				await expect(workoutPage.quickAddBtn(n)).toBeVisible()
			}
		})

		test('shows sets list with correct count', async ({ workoutPage }) => {
			await expect(workoutPage.setsLog).toBeVisible()
			await expect(workoutPage.setsCount).toContainText('Sets · 2')
		})

		test('shows each set row with reps and time', async ({ workoutPage }) => {
			const rows = workoutPage.setRows
			await expect(rows).toHaveCount(2)

			// Rows are reversed (newest first) — MOCK_SET_2 is at index 0
			await expect(rows.nth(0).getByTestId('set-reps')).toHaveText('+15')
			await expect(rows.nth(1).getByTestId('set-reps')).toHaveText('+10')
		})
	})

	// ─── Empty State ─────────────────────────────────────────────────────────────

	test.describe('Empty state (no sets today)', () => {
		test('shows empty placeholder when no sets exist', async ({
			page,
			workoutPage,
		}) => {
			await mockWorkoutToday(page, MOCK_TODAY_EMPTY)
			await workoutPage.goto()

			await expect(workoutPage.setsLogEmpty).toBeVisible()
			await expect(workoutPage.setsLogEmpty).toContainText('No sets yet')
			await expect(workoutPage.totalReps).toHaveText('0')
		})
	})

	// ─── Quick Add ───────────────────────────────────────────────────────────────

	test.describe('Quick-add buttons', () => {
		test.beforeEach(async ({ page, workoutPage }) => {
			// Re-mock today as empty so each add is clearly observable
			await mockWorkoutToday(page, MOCK_TODAY_EMPTY)
			await workoutPage.goto()
		})

		for (const reps of [5, 10, 15, 20] as const) {
			test(`clicking +${reps} adds ${reps} reps optimistically`, async ({
				page,
				workoutPage,
			}) => {
				const newSet = {
					id: `new-set-${reps}`,
					exerciseType: 'pushups',
					reps,
					createdAt: new Date().toISOString(),
				}

				await page.route(API_WORKOUT_SETS, (route) => {
					if (route.request().method() === 'POST') {
						route.fulfill({
							status: 200,
							contentType: 'application/json',
							body: JSON.stringify(newSet),
						})
					} else {
						route.continue()
					}
				})

				await workoutPage.quickAddBtn(reps).click()

				// Optimistic update: total reps increases immediately
				await expect(workoutPage.totalReps).toHaveText(String(reps))

				// A set row appears in the log
				await expect(workoutPage.setRows).toHaveCount(1)
				await expect(
					workoutPage.setRows.first().getByTestId('set-reps'),
				).toHaveText(`+${reps}`)
			})
		}

		test('quick-add buttons are disabled while submitting', async ({
			page,
			workoutPage,
		}) => {
			// Delay the API response to observe the disabled state
			await page.route(API_WORKOUT_SETS, async (route) => {
				await new Promise((r) => setTimeout(r, 300))
				route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({
						id: 'slow-set',
						exerciseType: 'pushups',
						reps: 10,
						createdAt: new Date().toISOString(),
					}),
				})
			})

			await workoutPage.quickAddBtn(10).click()

			// During inflight request the buttons should be disabled
			await expect(workoutPage.quickAddBtn(5)).toBeDisabled()
			await expect(workoutPage.quickAddBtn(20)).toBeDisabled()
		})
	})

	// ─── Delete Set ──────────────────────────────────────────────────────────────

	test.describe('Delete set', () => {
		test.beforeEach(async ({ workoutPage }) => {
			await workoutPage.goto()
		})

		test('shows confirm dialog when delete is clicked', async ({
			workoutPage,
		}) => {
			const firstRow = workoutPage.setRows.first()
			await firstRow.getByTestId('delete-set-trigger').click()

			await expect(workoutPage.page.getByRole('alertdialog')).toBeVisible()
			await expect(workoutPage.page.getByRole('alertdialog')).toContainText(
				'Remove this set?',
			)
		})

		test('cancel closes dialog without deleting', async ({ workoutPage }) => {
			const firstRow = workoutPage.setRows.first()
			await firstRow.getByTestId('delete-set-trigger').click()

			await workoutPage.page.getByRole('button', { name: 'Cancel' }).click()

			await expect(workoutPage.page.getByRole('alertdialog')).not.toBeVisible()
			await expect(workoutPage.setRows).toHaveCount(2)
		})

		test('confirm removes the set from the list', async ({
			page,
			workoutPage,
		}) => {
			await page.route(API_WORKOUT_SET_BY_ID, (route) => {
				if (route.request().method() === 'DELETE') {
					route.fulfill({
						status: 200,
						contentType: 'application/json',
						body: '{}',
					})
				} else {
					route.continue()
				}
			})

			const firstRow = workoutPage.setRows.first()
			await firstRow.getByTestId('delete-set-trigger').click()
			await workoutPage.page.getByRole('button', { name: 'Remove' }).click()

			// Optimistic removal: row disappears immediately
			await expect(workoutPage.setRows).toHaveCount(1)
		})

		test('shows reps info in the delete confirmation', async ({
			workoutPage,
		}) => {
			const firstRow = workoutPage.setRows.first()
			// Newest-first: MOCK_SET_2 (+15 reps) is at index 0
			await firstRow.getByTestId('delete-set-trigger').click()

			const dialog = workoutPage.page.getByRole('alertdialog')
			await expect(dialog).toContainText('+15 reps')
		})
	})

	// ─── Reset Day ───────────────────────────────────────────────────────────────

	test.describe('Reset day', () => {
		test.beforeEach(async ({ workoutPage }) => {
			await workoutPage.goto()
		})

		test('shows confirm dialog when Reset day is clicked', async ({
			workoutPage,
		}) => {
			await workoutPage.resetDayTrigger.click()

			const dialog = workoutPage.page.getByRole('alertdialog')
			await expect(dialog).toBeVisible()
			await expect(dialog).toContainText("Reset today's sets?")
		})

		test('cancel closes dialog without resetting', async ({ workoutPage }) => {
			await workoutPage.resetDayTrigger.click()
			await workoutPage.page.getByRole('button', { name: 'Cancel' }).click()

			await expect(workoutPage.page.getByRole('alertdialog')).not.toBeVisible()
			await expect(workoutPage.setsLog).toBeVisible()
		})

		test('confirm clears all sets and re-fetches today', async ({
			page,
			workoutPage,
		}) => {
			await page.route(API_WORKOUT_SETS, (route) => {
				if (route.request().method() === 'DELETE') {
					route.fulfill({
						status: 200,
						contentType: 'application/json',
						body: '{}',
					})
				} else {
					route.continue()
				}
			})

			// After reset, the store re-fetches today — return empty state
			await page.unroute(API_WORKOUT_TODAY)
			await mockWorkoutToday(page, MOCK_TODAY_EMPTY)

			await workoutPage.resetDayTrigger.click()
			await workoutPage.page.getByRole('button', { name: 'Reset' }).click()

			await expect(workoutPage.setsLogEmpty).toBeVisible()
			await expect(workoutPage.totalReps).toHaveText('0')
		})

		test('confirm dialog shows the set count', async ({ workoutPage }) => {
			await workoutPage.resetDayTrigger.click()

			const dialog = workoutPage.page.getByRole('alertdialog')
			await expect(dialog).toContainText('2 sets')
		})
	})

	// ─── Goal Editing ────────────────────────────────────────────────────────────

	test.describe('Goal editing', () => {
		test.beforeEach(async ({ workoutPage }) => {
			await workoutPage.goto()
		})

		test('displays current goal on the goal button', async ({
			workoutPage,
		}) => {
			await expect(workoutPage.goalDisplayBtn).toContainText('100')
		})

		test('clicking the goal button enters edit mode', async ({
			workoutPage,
		}) => {
			await workoutPage.goalDisplayBtn.click()

			await expect(workoutPage.goalInput).toBeVisible()
			await expect(workoutPage.goalSetBtn).toBeVisible()
			await expect(workoutPage.goalDisplayBtn).not.toBeVisible()
		})

		test('input is pre-filled with current goal when editing starts', async ({
			workoutPage,
		}) => {
			await workoutPage.goalDisplayBtn.click()

			await expect(workoutPage.goalInput).toHaveValue('100')
		})

		test('pressing Enter saves the new goal', async ({ page, workoutPage }) => {
			await page.route(API_WORKOUT_GOAL, (route) =>
				route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ exerciseType: 'pushups', targetReps: 150 }),
				}),
			)

			await workoutPage.goalDisplayBtn.click()
			await workoutPage.goalInput.fill('150')
			await workoutPage.goalInput.press('Enter')

			await expect(workoutPage.goalDisplayBtn).toBeVisible()
			await expect(workoutPage.goalDisplayBtn).toContainText('150')
		})

		test('clicking Set button saves the new goal', async ({
			page,
			workoutPage,
		}) => {
			await page.route(API_WORKOUT_GOAL, (route) =>
				route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ exerciseType: 'pushups', targetReps: 200 }),
				}),
			)

			await workoutPage.goalDisplayBtn.click()
			await workoutPage.goalInput.fill('200')
			await workoutPage.goalSetBtn.click()

			await expect(workoutPage.goalDisplayBtn).toBeVisible()
			await expect(workoutPage.goalDisplayBtn).toContainText('200')
		})

		test('pressing Escape cancels editing without saving', async ({
			workoutPage,
		}) => {
			await workoutPage.goalDisplayBtn.click()
			await workoutPage.goalInput.fill('999')
			await workoutPage.goalInput.press('Escape')

			await expect(workoutPage.goalDisplayBtn).toBeVisible()
			await expect(workoutPage.goalDisplayBtn).toContainText('100')
			await expect(workoutPage.goalInput).not.toBeVisible()
		})

		test('entering zero does not call the goal API', async ({
			page,
			workoutPage,
		}) => {
			let goalApiCalled = false
			await page.route(API_WORKOUT_GOAL, (route) => {
				goalApiCalled = true
				route.continue()
			})

			await workoutPage.goalDisplayBtn.click()
			await workoutPage.goalInput.fill('0')
			await workoutPage.goalInput.press('Enter')

			// Edit mode closes but goal stays at 100 (API never called)
			await expect(workoutPage.goalDisplayBtn).toBeVisible()
			await expect(workoutPage.goalDisplayBtn).toContainText('100')
			expect(goalApiCalled).toBe(false)
		})

		test('shows "Goal reached" when total meets or exceeds goal', async ({
			page,
			workoutPage,
		}) => {
			// total = 25, let's set goal to 20 so it's already reached
			await mockWorkoutToday(page, {
				sets: [],
				goal: { exerciseType: 'pushups', targetReps: 20 },
				total: 25,
			})
			await workoutPage.goto()

			await expect(workoutPage.goalReached).toBeVisible()
			await expect(workoutPage.goalReached).toContainText('Goal reached')
			await expect(workoutPage.repsLeft).not.toBeVisible()
		})
	})

	// ─── Auth Redirect ───────────────────────────────────────────────────────────

	test.describe('Auth redirect', () => {
		test('unauthenticated access redirects to login', async ({ page }) => {
			await page.unroute(API_ME)
			await page.route(API_ME, (route) =>
				route.fulfill({
					status: 401,
					contentType: 'application/json',
					body: JSON.stringify(AUTH_ERRORS.UNAUTHORIZED),
				}),
			)

			await page.goto(WORKOUT_PATH)
			await expect(page).toHaveURL(LOGIN_PATH)
		})
	})
})
