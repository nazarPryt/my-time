import { API_PREFIX, RELEASE_NOTES, RELEASES_ROUTES } from '@my-time/contracts'
import type { Page, Request } from '@playwright/test'

export const API_RELEASES_SEEN = `**${API_PREFIX}${RELEASES_ROUTES.prefix}${RELEASES_ROUTES.seen}`

export const LATEST_RELEASE = RELEASE_NOTES[0]?.version ?? '0.0.0'

/**
 * Stubs GET/PUT `/releases/seen`. PUT echoes the version back and is
 * recorded in the returned array so specs can assert it was sent.
 */
export async function mockReleasesSeen(
	page: Page,
	lastSeenVersion: string | null = LATEST_RELEASE,
) {
	const puts: Request[] = []
	await page.route(API_RELEASES_SEEN, (route) => {
		const request = route.request()
		if (request.method() === 'PUT') {
			puts.push(request)
			const { version } = request.postDataJSON() as { version: string }
			lastSeenVersion = version
		}
		return route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ lastSeenVersion }),
		})
	})
	return puts
}
