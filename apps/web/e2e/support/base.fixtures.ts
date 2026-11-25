import { API_PREFIX } from '@my-time/contracts'
import { test as base, expect } from '@playwright/test'

const API_PATTERN = `**${API_PREFIX}/**`

// Fails any spec whose API call has no mock (page.route wins over this context route).
export const test = base.extend<{ unmockedApiGuard: undefined }>({
	unmockedApiGuard: [
		async ({ context }, use) => {
			const unmocked: string[] = []
			await context.route(API_PATTERN, (route) => {
				const request = route.request()
				unmocked.push(`${request.method()} ${new URL(request.url()).pathname}`)
				return route.fulfill({
					status: 501,
					contentType: 'application/json',
					body: JSON.stringify({ message: 'Unmocked API request in e2e' }),
				})
			})
			await use(undefined)
			expect(unmocked, 'API requests without a mock').toEqual([])
		},
		{ auto: true },
	],
})

export { expect }
