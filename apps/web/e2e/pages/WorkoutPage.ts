import type { Page, Locator } from '@playwright/test'
import type {
	MeResponse,
	SetResponse,
	TodayResponse,
	ProgressResponse,
} from 'contracts'
import { Route as WorkoutRoute } from '../../src/routes/dashboard/workout'
import { Route as DashboardIndexRoute } from '../../src/routes/dashboard/index'
import { Route as LoginRoute } from '../../src/routes/auth/login'

export const WORKOUT_PATH = WorkoutRoute.fullPath
export const DASHBOARD_PATH = DashboardIndexRoute.fullPath
export const LOGIN_PATH = LoginRoute.fullPath

export const API_ME = '**/api/v1/auth/me'
export const API_WORKOUT_TODAY = '**/api/v1/workout/today*'
export const API_WORKOUT_SETS = '**/api/v1/workout/sets'
export const API_WORKOUT_SET_BY_ID = '**/api/v1/workout/sets/*'
export const API_WORKOUT_GOAL = '**/api/v1/workout/goal'
export const API_WORKOUT_PROGRESS = '**/api/v1/workout/progress*'

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

	// Page container
	readonly workoutPage: Locator
	readonly workoutLoading: Locator

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
		this.workoutLoading = page.getByTestId('workout-loading')

		this.header = page.getByTestId('workout-header')
		this.dateLabel = page.getByTestId('workout-date')

		this.heroCounter = page.getByTestId('hero-counter')
		this.totalReps = page.getByTestId('total-reps')
		this.progressBarFill = page.getByTestId('progress-bar-fill')
		this.repsLeft = page.getByTestId('reps-left')
		this.goalReached = page.getByTestId('goal-reached')
		this.goalDisplayBtn = page.getByTestId('goal-display-btn')
		this.goalInput = page.getByTestId('goal-input')
		this.goalSetBtn = page.getByTestId('goal-set-btn')

		this.quickAddButtons = page.getByTestId('quick-add-buttons')

		this.setsLogEmpty = page.getByTestId('sets-log-empty')
		this.setsLog = page.getByTestId('sets-log')
		this.setsCount = page.getByTestId('sets-count')
		this.resetDayTrigger = page.getByTestId('reset-day-trigger')
		this.setRows = page.getByTestId('set-row')

		this.progressChart = page.getByTestId('progress-chart')
		this.chartMonthLabel = page.getByTestId('chart-month-label')
		this.prevMonthBtn = page.getByTestId('prev-month-btn')
		this.nextMonthBtn = page.getByTestId('next-month-btn')
		this.chartLoading = page.getByTestId('chart-loading')
	}

	quickAddBtn(reps: number) {
		return this.page.getByTestId(`quick-add-${reps}`)
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
