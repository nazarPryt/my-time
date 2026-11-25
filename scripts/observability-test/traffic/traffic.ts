import {
	expectStatus,
	jsonBody,
	refreshCookie,
	touchStream,
} from './api-client'

/** What the traffic did; the dashboards must show exactly this. */
export type Counts = {
	users: number
	register: number
	login: number
	loginFailed: number
	refresh: number
	refreshFailed: number
	logout: number
	clientErrors: number
}

export const USERS = ['alice', 'bob', 'carol'] as const
export const CLIENT_ERROR_REPORTS = ['web', 'web', 'extension'] as const

// Requests one user makes per feature in useFeatures (Requests by feature panel).
export const FEATURE_REQUESTS = {
	'time-tracker': 5,
	workout: 2,
	'site-blocking': 1,
	permesso: 2,
}

const PASSWORD = 'Password123!'

/** The first requests of every feature page, so feature and route panels fill up. */
async function useFeatures(token: string) {
	for (const path of [
		'/auth/me',
		'/time-tracker/today',
		'/time-tracker/weekly',
		'/workout/today',
		'/workout/progress?year=2026&month=1',
		'/site-blocking/',
		'/permesso/',
		'/permesso/history',
	])
		await expectStatus(path, 200, { token })

	const started = await expectStatus('/time-tracker/start', 200, {
		method: 'POST',
		token,
		body: jsonBody({ type: 'work' }),
	})
	const { id } = (await started.json()) as { id: string }
	await expectStatus(`/time-tracker/${id}/end`, 200, { method: 'PATCH', token })
	await touchStream('/time-tracker/events', token)
}

/** Sends a known mix of traffic to the test API and counts every event. */
export async function generateTraffic(
	log: (line: string) => void,
): Promise<Counts> {
	const run = Date.now()
	const counts: Counts = {
		users: 0,
		register: 0,
		login: 0,
		loginFailed: 0,
		refresh: 0,
		refreshFailed: 0,
		logout: 0,
		clientErrors: 0,
	}

	for (const name of USERS) {
		const email = `${name}-${run}@example.com`
		const registered = await expectStatus('/auth/register', 200, {
			method: 'POST',
			body: jsonBody({ name, email, password: PASSWORD }),
		})
		counts.register++
		counts.users++
		const { tokens } = (await registered.json()) as {
			tokens: { accessToken: string }
		}
		await useFeatures(tokens.accessToken)
		await expectStatus('/auth/logout', 200, {
			method: 'POST',
			cookie: refreshCookie(registered),
		})
		counts.logout++
		log(`${name}: signed up, used every feature, logged out`)

		// The last user stays out; the others mistype their password first.
		if (name === USERS.at(-1)) continue
		await expectStatus('/auth/login', 401, {
			method: 'POST',
			body: jsonBody({ email, password: 'wrong-password' }),
		})
		counts.loginFailed++
		const loggedIn = await expectStatus('/auth/login', 200, {
			method: 'POST',
			body: jsonBody({ email, password: PASSWORD }),
		})
		counts.login++
		await expectStatus('/auth/refresh', 200, {
			method: 'POST',
			cookie: refreshCookie(loggedIn),
		})
		counts.refresh++
		log(`${name}: failed login, logged in, refreshed the token`)
	}

	await expectStatus('/auth/refresh', 401, {
		method: 'POST',
		cookie: 'refreshToken=unknown',
	})
	counts.refreshFailed++

	for (const source of CLIENT_ERROR_REPORTS) {
		await expectStatus('/client-errors/', 204, {
			method: 'POST',
			body: jsonBody({
				source,
				message: 'observability:test synthetic error',
				url: 'http://localhost/dashboard',
				appVersion: 'observability-test',
			}),
		})
		counts.clientErrors++
	}
	await expectStatus('/does-not-exist', 404)
	log('bad refresh token, client errors and a 404 sent')
	return counts
}
