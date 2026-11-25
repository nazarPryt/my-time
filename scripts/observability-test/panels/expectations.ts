import {
	CLIENT_ERROR_REPORTS,
	type Counts,
	FEATURE_REQUESTS,
} from '../traffic/traffic'

/**
 * Panels that stay empty in the test stack because nothing there can happen
 * (no nginx, no TLS, no slow query, no 5xx, no job run yet). Every other panel
 * must return data, so a renamed metric, label or log message fails the test.
 */
export const ALLOWED_EMPTY: Record<string, string[]> = {
	'my-time-api-overview': ['Routes with most 5xx', 'Request failed'],
	'my-time-infrastructure': [
		'Slow query log',
		'TLS certificate expires in',
		'nginx 5xx responses',
		'nginx 5xx requests',
	],
	'my-time-jobs': [
		'Job duration (avg)',
		'Job log',
		'Permesso check failed',
		'SSE errors',
	],
}

/** How a panel's result is reduced to the number(s) compared with Counts. */
type Reduce =
	| 'last' // stat panels: the single value
	| 'rows' // logs panels: number of lines
	| { sumBy: string } // bar panels: total per label value, over all buckets

export type Expectation = {
	dashboard: string
	panel: string
	reduce: Reduce
	expected: (counts: Counts) => number | Record<string, number>
}

const STAT_PANELS: [string, (c: Counts) => number][] = [
	['Sign-ups', (c) => c.register],
	['Logins', (c) => c.login],
	['Failed logins', (c) => c.loginFailed],
	['Token refresh failures', (c) => c.refreshFailed],
	['Client errors', (c) => c.clientErrors],
	['Active users (range)', (c) => c.users],
	['Daily active users (rolling 24 h)', (c) => c.users],
]

export const EXPECTATIONS: Expectation[] = [
	...STAT_PANELS.map(
		([panel, expected]): Expectation => ({
			dashboard: 'my-time-activity',
			panel,
			reduce: 'last',
			expected,
		}),
	),
	{
		dashboard: 'my-time-activity',
		panel: 'Auth events',
		reduce: { sumBy: 'event' },
		expected: (c) => ({
			register: c.register,
			login: c.login,
			login_failed: c.loginFailed,
			refresh: c.refresh,
			refresh_failed: c.refreshFailed,
			logout: c.logout,
		}),
	},
	{
		dashboard: 'my-time-activity',
		panel: 'Requests by feature',
		reduce: { sumBy: 'feature' },
		expected: (c) =>
			Object.fromEntries(
				Object.entries(FEATURE_REQUESTS).map(([feature, n]) => [
					feature,
					n * c.users,
				]),
			),
	},
	{
		dashboard: 'my-time-activity',
		panel: 'Client errors by source',
		reduce: { sumBy: 'source' },
		expected: () => {
			const bySource: Record<string, number> = {}
			for (const source of CLIENT_ERROR_REPORTS)
				bySource[source] = (bySource[source] ?? 0) + 1
			return bySource
		},
	},
	{
		dashboard: 'my-time-activity',
		panel: 'Client errors reported',
		reduce: 'rows',
		expected: (c) => c.clientErrors,
	},
	{
		dashboard: 'my-time-activity',
		panel: 'Failed logins and refresh failures',
		reduce: 'rows',
		expected: (c) => c.loginFailed + c.refreshFailed,
	},
]
