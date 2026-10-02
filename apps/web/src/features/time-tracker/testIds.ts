export const TIME_TRACKER_TEST_IDS = {
	// Page shell
	page: 'time-tracker-page',
	loading: 'time-tracker-loading',

	// Timer card
	statusBadge: 'tt-status-badge',
	timer: 'tt-timer',
	startBtn: 'tt-start-btn',
	stopBtn: 'tt-stop-btn',
	deleteTrigger: 'tt-delete-trigger',

	// Today stats
	todayStats: 'tt-today-stats',
	statToday: 'tt-stat-today',
	statSessions: 'tt-stat-sessions',
	statLongest: 'tt-stat-longest',

	// Session list
	sessionList: 'tt-session-list',
	sessionRow: 'tt-session-row',
	sessionTime: 'tt-session-time',
	sessionDuration: 'tt-session-duration',
	sessionActiveBadge: 'tt-session-active',
	sessionAbandoned: 'tt-session-abandoned',
} as const
