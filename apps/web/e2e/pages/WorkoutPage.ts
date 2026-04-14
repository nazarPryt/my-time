import type { Locator, Page } from '@playwright/test'
import type {
	MeResponse,
	ProgressResponse,
	SetResponse,
	TodayResponse,
} from 'contracts'
import { API_PREFIX, AUTH_ROUTES, WORKOUT_ROUTES } from 'contracts'

export const WORKOUT_PATH = '/dashboard/workout' //todo check tanstack router for those path constants
export const DASHBOARD_PATH = '/dashboard/'
export const LOGIN_PATH = '/auth/login'

/** Convert Elysia route params (`:id`) to Playwright glob wildcards (`*`). */
const glob = (route: string) => route.replace(/:[^/]+/g, '*')

const base = `**${API_PREFIX}`
const auth = `${base}${AUTH_ROUTES.prefix}`
const workout = `${base}${WORKOUT_ROUTES.prefix}`

export const API_ME = `${auth}${AUTH_ROUTES.me}`
export const API_WORKOUT_TODAY = `${workout}${WORKOUT_ROUTES.today}*`
export const API_WORKOUT_SETS = `${workout}${WORKOUT_ROUTES.sets}`
export const API_WORKOUT_SET_BY_ID = glob(`${workout}${WORKOUT_ROUTES.setById}`)
export const API_WORKOUT_GOAL = `${workout}${WORKOUT_ROUTES.goal}`
export const API_WORKOUT_PROGRESS = `${workout}${WORKOUT_ROUTES.progress}*`

export const MOCK_USER: MeResponse = {
	id: 'user-1',
	email: 'test@example.com',
	name: 'Test User',
}

export const MOCK_SET_1: SetResponse = {
	id: 'set-1',
	exerciseType: 'pushups',
	reps: 10,
	createdAt: '2026-04-14T09:30:00.000Z',
}

export const MOCK_SET_2: SetResponse = {
	id: 'set-2',
	exerciseType: 'pushups',
	reps: 15,
	createdAt: '2026-04-14T10:00:00.000Z',
}

export const MOCK_TODAY_EMPTY: TodayResponse = {
	sets: [],
	goal: { exerciseType: 'pushups', targetReps: 100 },
	total: 0,
}

export const MOCK_TODAY_WITH_SETS: TodayResponse = {
	sets: [MOCK_SET_1, MOCK_SET_2],
	goal: { exerciseType: 'pushups', targetReps: 100 },
	total: 25,
}

export const MOCK_PROGRESS: ProgressResponse = {
	days: Array.from({ length: 30 }, (_, i) => ({
		date: `2026-04-${String(i + 1).padStart(2, '0')}`,
		total: i === 13 ? 25 : i % 5 === 0 ? 110 : i % 3 === 0 ? 60 : 0,
	})),
	goal: { exerciseType: 'pushups', targetReps: 100 },
}

export class WorkoutPage {
	readonly page: Page

	// Page containers
	readonly workoutPage: Locator
	readonly workoutLoading: Locator
	readonly dashboardHome: Locator

	// Header
	readonly header: Locator
	readonly dateLabel: Locator

	// Hero counter
	readonly heroCounter: Locator
	readonly totalReps: Locator
	readonly progressBarFill: Locator
	readonly repsLeft: Locator
	readonly goalReached: Locator
	readonly goalDisplayBtn: Locator
	readonly goalInput: Locator
	readonly goalSetBtn: Locator

	// Quick add buttons
	readonly quickAddButtons: Locator

	// Sets log
	readonly setsLogEmpty: Locator
	readonly setsLog: Locator
	readonly setsCount: Locator
	readonly resetDayTrigger: Locator
	readonly setRows: Locator

	// Progress chart
	readonly progressChart: Locator
	readonly chartMonthLabel: Locator
	readonly prevMonthBtn: Locator
	readonly nextMonthBtn: Locator
	readonly chartLoading: Locator

	constructor(page: Page) {
		this.page = page

		this.workoutPage = page.getByTestId('workout-page')
		this.workoutLoading = this.workoutPage.getByTestId('workout-loading')
		this.dashboardHome = page.getByTestId('dashboard-home')

		this.header = this.workoutPage.getByTestId('workout-header')
		this.dateLabel = this.header.getByTestId('workout-date')

		this.heroCounter = this.workoutPage.getByTestId('hero-counter')
		this.totalReps = this.heroCounter.getByTestId('total-reps')
		this.progressBarFill = this.heroCounter.getByTestId('progress-bar-fill')
		this.repsLeft = this.heroCounter.getByTestId('reps-left')
		this.goalReached = this.heroCounter.getByTestId('goal-reached')
		this.goalDisplayBtn = this.heroCounter.getByTestId('goal-display-btn')
		this.goalInput = this.heroCounter.getByTestId('goal-input')
		this.goalSetBtn = this.heroCounter.getByTestId('goal-set-btn')

		this.quickAddButtons = this.workoutPage.getByTestId('quick-add-buttons')

		this.setsLogEmpty = this.workoutPage.getByTestId('sets-log-empty')
		this.setsLog = this.workoutPage.getByTestId('sets-log')
		this.setsCount = this.setsLog.getByTestId('sets-count')
		this.resetDayTrigger = this.setsLog.getByTestId('reset-day-trigger')
		this.setRows = this.setsLog.getByTestId('set-row')

		this.progressChart = this.dashboardHome.getByTestId('progress-chart')
		this.chartMonthLabel = this.progressChart.getByTestId('chart-month-label')
		this.prevMonthBtn = this.progressChart.getByTestId('prev-month-btn')
		this.nextMonthBtn = this.progressChart.getByTestId('next-month-btn')
		this.chartLoading = this.progressChart.getByTestId('chart-loading')
	}

	quickAddBtn(reps: number) {
		return this.quickAddButtons.getByTestId(`quick-add-${reps}`)
	}

	async mockAuth() {
		await this.page.route(API_ME, (route) =>
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(MOCK_USER),
			}),
		)
	}

	async mockToday(data = MOCK_TODAY_WITH_SETS) {
		await this.page.route(API_WORKOUT_TODAY, (route) =>
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(data),
			}),
		)
	}

	async mockProgress(data = MOCK_PROGRESS) {
		await this.page.route(API_WORKOUT_PROGRESS, (route) =>
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(data),
			}),
		)
	}

	async goto() {
		await this.page.goto(WORKOUT_PATH)
		await this.heroCounter.waitFor({ state: 'visible' })
	}

	async gotoDashboard() {
		await this.page.goto(DASHBOARD_PATH)
		await this.page.getByTestId('dashboard-home').waitFor({ state: 'visible' })
	}
}
