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
