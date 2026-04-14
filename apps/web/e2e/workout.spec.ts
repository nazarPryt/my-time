import { expect, test } from '@playwright/test'
import { AUTH_ERRORS } from 'contracts'
import {
	API_ME,
	API_WORKOUT_GOAL,
	API_WORKOUT_SET_BY_ID,
	API_WORKOUT_SETS,
	API_WORKOUT_TODAY,
	LOGIN_PATH,
	MOCK_PROGRESS,
	MOCK_SET_1,
	MOCK_SET_2,
	MOCK_TODAY_EMPTY,
	WORKOUT_PATH,
	WorkoutPage,
} from './pages/WorkoutPage'

test.describe('Workout page', () => {
	let workout: WorkoutPage

	test.beforeEach(async ({ page }) => {
		workout = new WorkoutPage(page)
		await workout.mockAuth()
		await workout.mockToday()
		await workout.mockProgress()
	})

	// ─── Page Load ──────────────────────────────────────────────────────────────

	test.describe('Initial load', () => {
		test.beforeEach(async () => {
			await workout.goto()
		})

		test('shows the workout header', async () => {
			await expect(workout.header).toBeVisible()
			await expect(workout.header).toContainText('Workout')
		})

		test("shows today's date in the header", async () => {
			await expect(workout.dateLabel).toBeVisible()
			// date-fns formats as "EEEE, MMMM d" e.g. "Monday, April 14"
			await expect(workout.dateLabel).toHaveText(/[A-Z][a-z]+, [A-Z][a-z]+ \d+/)
		})

		test('shows total reps from API response', async () => {
			await expect(workout.totalReps).toHaveText('25')
		})

		test('shows progress bar', async () => {
			await expect(workout.progressBarFill).toBeVisible()
		})

		test('shows reps remaining toward goal', async () => {
			await expect(workout.repsLeft).toHaveText('75 left')
		})

		test('shows current goal on the goal button', async () => {
			await expect(workout.goalDisplayBtn).toContainText('100')
		})

		test('shows all four quick-add buttons', async () => {
			for (const n of [5, 10, 15, 20]) {
				await expect(workout.quickAddBtn(n)).toBeVisible()
			}
		})

		test('shows sets list with correct count', async () => {
			await expect(workout.setsLog).toBeVisible()
			await expect(workout.setsCount).toContainText('Sets · 2')
		})

		test('shows each set row with reps and time', async () => {
			const rows = workout.setRows
			await expect(rows).toHaveCount(2)

			// Rows are reversed (newest first) — MOCK_SET_2 is at index 0
			await expect(rows.nth(0).getByTestId('set-reps')).toHaveText('+15')
			await expect(rows.nth(1).getByTestId('set-reps')).toHaveText('+10')
		})
	})

	// ─── Empty State ─────────────────────────────────────────────────────────────

	test.describe('Empty state (no sets today)', () => {
		test('shows empty placeholder when no sets exist', async ({ page }) => {
			workout = new WorkoutPage(page)
			await workout.mockAuth()
			await workout.mockToday(MOCK_TODAY_EMPTY)
			await workout.mockProgress()
			await workout.goto()

			await expect(workout.setsLogEmpty).toBeVisible()
			await expect(workout.setsLogEmpty).toContainText('No sets yet')
			await expect(workout.totalReps).toHaveText('0')
		})
	})

	// ─── Quick Add ───────────────────────────────────────────────────────────────

	test.describe('Quick-add buttons', () => {
		test.beforeEach(async ({ page }) => {
			// Re-mock today as empty so each add is clearly observable
			workout = new WorkoutPage(page)
			await workout.mockAuth()
			await workout.mockToday(MOCK_TODAY_EMPTY)
			await workout.mockProgress()

			await page.route(API_WORKOUT_TODAY, (route) =>
				route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify(MOCK_TODAY_EMPTY),
				}),
			)
			await workout.goto()
		})

		for (const reps of [5, 10, 15, 20] as const) {
			test(`clicking +${reps} adds ${reps} reps optimistically`, async ({
				page,
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

				await workout.quickAddBtn(reps).click()

				// Optimistic update: total reps increases immediately
				await expect(workout.totalReps).toHaveText(String(reps))

				// A set row appears in the log
				await expect(workout.setRows).toHaveCount(1)
				await expect(
					workout.setRows.first().getByTestId('set-reps'),
				).toHaveText(`+${reps}`)
			})
		}

		test('quick-add buttons are disabled while submitting', async ({
			page,
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

			await workout.quickAddBtn(10).click()

			// During inflight request the buttons should be disabled
			await expect(workout.quickAddBtn(5)).toBeDisabled()
			await expect(workout.quickAddBtn(20)).toBeDisabled()
		})
	})

	// ─── Delete Set ──────────────────────────────────────────────────────────────

	test.describe('Delete set', () => {
		test.beforeEach(async () => {
			await workout.goto()
		})

		test('shows confirm dialog when delete is clicked', async () => {
			const firstRow = workout.setRows.first()
			await firstRow.getByTestId('delete-set-trigger').click()

			await expect(workout.page.getByRole('alertdialog')).toBeVisible()
			await expect(workout.page.getByRole('alertdialog')).toContainText(
				'Remove this set?',
			)
		})

		test('cancel closes dialog without deleting', async () => {
			const firstRow = workout.setRows.first()
			await firstRow.getByTestId('delete-set-trigger').click()

			await workout.page.getByRole('button', { name: 'Cancel' }).click()

			await expect(workout.page.getByRole('alertdialog')).not.toBeVisible()
			await expect(workout.setRows).toHaveCount(2)
		})

		test('confirm removes the set from the list', async ({ page }) => {
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

			const firstRow = workout.setRows.first()
			await firstRow.getByTestId('delete-set-trigger').click()
			await workout.page.getByRole('button', { name: 'Remove' }).click()

			// Optimistic removal: row disappears immediately
			await expect(workout.setRows).toHaveCount(1)
		})

		test('shows reps info in the delete confirmation', async () => {
			const firstRow = workout.setRows.first()
			// Newest-first: MOCK_SET_2 (+15 reps) is at index 0
			await firstRow.getByTestId('delete-set-trigger').click()

			const dialog = workout.page.getByRole('alertdialog')
			await expect(dialog).toContainText('+15 reps')
		})
	})

	// ─── Reset Day ───────────────────────────────────────────────────────────────

	test.describe('Reset day', () => {
		test.beforeEach(async () => {
			await workout.goto()
		})

		test('shows confirm dialog when Reset day is clicked', async () => {
			await workout.resetDayTrigger.click()

			const dialog = workout.page.getByRole('alertdialog')
			await expect(dialog).toBeVisible()
			await expect(dialog).toContainText("Reset today's sets?")
		})

		test('cancel closes dialog without resetting', async () => {
			await workout.resetDayTrigger.click()
			await workout.page.getByRole('button', { name: 'Cancel' }).click()

			await expect(workout.page.getByRole('alertdialog')).not.toBeVisible()
			await expect(workout.setsLog).toBeVisible()
		})

		test('confirm clears all sets and re-fetches today', async ({ page }) => {
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
			await page.route(API_WORKOUT_TODAY, (route) =>
				route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify(MOCK_TODAY_EMPTY),
				}),
			)

			await workout.resetDayTrigger.click()
			await workout.page.getByRole('button', { name: 'Reset' }).click()

			await expect(workout.setsLogEmpty).toBeVisible()
			await expect(workout.totalReps).toHaveText('0')
		})

		test('confirm dialog shows the set count', async () => {
			await workout.resetDayTrigger.click()

			const dialog = workout.page.getByRole('alertdialog')
			await expect(dialog).toContainText('2 sets')
		})
	})

	// ─── Goal Editing ────────────────────────────────────────────────────────────

	test.describe('Goal editing', () => {
		test.beforeEach(async () => {
			await workout.goto()
		})

		test('displays current goal on the goal button', async () => {
			await expect(workout.goalDisplayBtn).toContainText('100')
		})

		test('clicking the goal button enters edit mode', async () => {
			await workout.goalDisplayBtn.click()

			await expect(workout.goalInput).toBeVisible()
			await expect(workout.goalSetBtn).toBeVisible()
			await expect(workout.goalDisplayBtn).not.toBeVisible()
		})

		test('input is pre-filled with current goal when editing starts', async () => {
			await workout.goalDisplayBtn.click()

			await expect(workout.goalInput).toHaveValue('100')
		})

		test('pressing Enter saves the new goal', async ({ page }) => {
			await page.route(API_WORKOUT_GOAL, (route) =>
				route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ exerciseType: 'pushups', targetReps: 150 }),
				}),
			)

			await workout.goalDisplayBtn.click()
			await workout.goalInput.fill('150')
			await workout.goalInput.press('Enter')

			await expect(workout.goalDisplayBtn).toBeVisible()
			await expect(workout.goalDisplayBtn).toContainText('150')
		})

		test('clicking Set button saves the new goal', async ({ page }) => {
			await page.route(API_WORKOUT_GOAL, (route) =>
				route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ exerciseType: 'pushups', targetReps: 200 }),
				}),
			)

			await workout.goalDisplayBtn.click()
			await workout.goalInput.fill('200')
			await workout.goalSetBtn.click()

			await expect(workout.goalDisplayBtn).toBeVisible()
			await expect(workout.goalDisplayBtn).toContainText('200')
		})

		test('pressing Escape cancels editing without saving', async () => {
			await workout.goalDisplayBtn.click()
			await workout.goalInput.fill('999')
			await workout.goalInput.press('Escape')

			await expect(workout.goalDisplayBtn).toBeVisible()
			await expect(workout.goalDisplayBtn).toContainText('100')
			await expect(workout.goalInput).not.toBeVisible()
		})

		test('entering zero does not call the goal API', async ({ page }) => {
			let goalApiCalled = false
			await page.route(API_WORKOUT_GOAL, (route) => {
				goalApiCalled = true
				route.continue()
			})

			await workout.goalDisplayBtn.click()
			await workout.goalInput.fill('0')
			await workout.goalInput.press('Enter')

			// Edit mode closes but goal stays at 100 (API never called)
			await expect(workout.goalDisplayBtn).toBeVisible()
			await expect(workout.goalDisplayBtn).toContainText('100')
			expect(goalApiCalled).toBe(false)
		})

		test('shows "Goal reached" when total meets or exceeds goal', async ({
			page,
		}) => {
			// total = 25, let's set goal to 20 so it's already reached
			workout = new WorkoutPage(page)
			await workout.mockAuth()
			await workout.mockToday({
				sets: [MOCK_SET_1, MOCK_SET_2],
				goal: { exerciseType: 'pushups', targetReps: 20 },
				total: 25,
			})
			await workout.mockProgress()
			await workout.goto()

			await expect(workout.goalReached).toBeVisible()
			await expect(workout.goalReached).toContainText('Goal reached')
			await expect(workout.repsLeft).not.toBeVisible()
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

// ─── Progress Chart (Dashboard Home) ─────────────────────────────────────────

test.describe('Workout progress chart', () => {
	let workout: WorkoutPage

	test.beforeEach(async ({ page }) => {
		workout = new WorkoutPage(page)
		await workout.mockAuth()
		await workout.mockProgress()

		// Dashboard home also renders the time tracker chart — stub it out
		await page.route('**/api/v1/time-entries/progress*', (route) =>
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ days: [], goal: null }),
			}),
		)

		await workout.gotoDashboard()
	})

	test('renders the progress chart', async () => {
		await expect(workout.progressChart).toBeVisible()
	})

	test('shows the current month label', async () => {
		await expect(workout.chartMonthLabel).toBeVisible()
		// e.g. "April 2026"
		await expect(workout.chartMonthLabel).toHaveText(/[A-Z][a-z]+ \d{4}/)
	})

	test('next-month button is disabled on the current month', async () => {
		await expect(workout.nextMonthBtn).toBeDisabled()
	})

	test('prev-month button navigates to the previous month', async ({
		page,
	}) => {
		const currentLabel = await workout.chartMonthLabel.textContent()

		// Mock progress for the previous month too
		await page.route('**/api/v1/workout/progress*', (route) =>
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(MOCK_PROGRESS),
			}),
		)

		await workout.prevMonthBtn.click()

		const newLabel = await workout.chartMonthLabel.textContent()
		expect(newLabel).not.toBe(currentLabel)
	})

	test('next-month button becomes enabled after navigating back', async ({
		page,
	}) => {
		await page.route('**/api/v1/workout/progress*', (route) =>
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(MOCK_PROGRESS),
			}),
		)

		await workout.prevMonthBtn.click()
		await expect(workout.nextMonthBtn).toBeEnabled()
	})

	test('shows loading state while fetching chart data', async ({ page }) => {
		// Remove existing mock and add a delayed one
		await page.unroute('**/api/v1/workout/progress*')
		let resolveProgress!: () => void
		await page.route('**/api/v1/workout/progress*', async (route) => {
			await new Promise<void>((r) => {
				resolveProgress = r
			})
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(MOCK_PROGRESS),
			})
		})

		await workout.prevMonthBtn.click()

		await expect(workout.chartLoading).toBeVisible()
		resolveProgress()
		await expect(workout.chartLoading).not.toBeVisible()
	})
})
