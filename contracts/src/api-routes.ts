export const API_PREFIX = '/api/v1'

export const AUTH_ROUTES = {
	prefix: '/auth',
	register: '/register',
	login: '/login',
	refresh: '/refresh',
	logout: '/logout',
	me: '/me',
	extensionToken: '/extension-token',
	exchangeExtensionToken: '/exchange-extension-token',
	loginExtension: '/login-extension',
	refreshExtension: '/refresh-extension',
} as const

export const WORKOUT_ROUTES = {
	prefix: '/workout',
	today: '/today',
	sets: '/sets',
	setById: '/sets/:id',
	goal: '/goal',
	progress: '/progress',
} as const

export const TIME_TRACKER_ROUTES = {
	prefix: '/time-tracker',
	active: '/active',
	today: '/today',
	weekly: '/weekly',
	start: '/start',
	endById: '/:id/end',
	deleteById: '/:id',
} as const

export const SITE_BLOCKING_ROUTES = {
	prefix: '/site-blocking',
	root: '/',
	deleteById: '/:id',
} as const
