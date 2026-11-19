import type { Page } from '@playwright/test'
import { mockReleasesSeen } from '../../support/releases.mocks'
import { mockSettingsNavigation } from '../settings/settings.mocks'

export { LATEST_RELEASE } from '../../support/releases.mocks'

/** The shell is tested on Settings, the tab with the fewest API calls. */
export async function mockWhatsNewPage(
	page: Page,
	lastSeenVersion: string | null,
) {
	await mockSettingsNavigation(page)
	return mockReleasesSeen(page, lastSeenVersion)
}
