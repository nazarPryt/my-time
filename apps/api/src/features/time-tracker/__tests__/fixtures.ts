import { treaty } from '@elysiajs/eden'
import type { RegisterRequest } from 'contracts'
import { AuthResponseSchema } from 'contracts'
import { app } from '@/app'

// ---------------------------------------------------------------------------
// Eden Treaty client
//
// Not exported: Eden's inferred client type isn't nameable outside this file
// (TS2883, since this is a composite project with declaration emit), and
// every other feature's test suite already instantiates its own local client
// rather than sharing one — registerAndGetToken below is the only thing here
// that needs it.
// ---------------------------------------------------------------------------
// parseDate: false — Eden Treaty otherwise auto-converts ISO-date-looking
// JSON strings back into `Date` instances on the client, which breaks the
// contracts' `z.string()` fields the moment a test asserts against them.
// Disabling it keeps what these tests see equal to the real wire format
// (JSON always sends strings), matching what the contracts actually declare.
const api = treaty(app, { parseDate: false }).api.v1

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const VALID_USER: RegisterRequest = {
	email: 'tracker@example.com',
	name: 'Tracker User',
	password: 'password123',
}

// A second, distinct user — needed by tests that check that one user's
// sessions (and mutations against them) are isolated from another's.
export const OTHER_USER: RegisterRequest = {
	email: 'tracker-other@example.com',
	name: 'Other Tracker User',
	password: 'password123',
}

export async function registerAndGetToken(user: RegisterRequest) {
	const { data } = await api.auth.register.post(user)
	const auth = AuthResponseSchema.parse(data)
	return {
		token: auth.tokens.accessToken,
		userId: auth.user.id,
	}
}

export function authHeaders(token: string) {
	return { authorization: `Bearer ${token}` }
}
