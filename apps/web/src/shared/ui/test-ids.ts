export const SHARED_TEST_IDS = {
	confirmDialog: {
		root: 'confirm-dialog',
		cancel: 'confirm-dialog-cancel',
		confirm: 'confirm-dialog-confirm',
	},
	errorScreen: {
		root: 'error-screen',
		title: 'error-screen-title',
		message: 'error-screen-message',
		reset: 'error-screen-reset',
	},
	notFoundScreen: {
		root: 'not-found-screen',
		homeLink: 'not-found-home-link',
	},
} as const

export type NavKey =
	| 'home'
	| 'workout'
	| 'time-tracker'
	| 'site-blocking'
	| 'permesso-status'
	| 'settings'

export const DASHBOARD_TEST_IDS = {
	home: 'dashboard-home',
	navLink: (key: NavKey) => `nav-${key}`,
} as const
