import { expect, test } from './whats-new.fixtures'
import { LATEST_RELEASE, mockWhatsNewPage } from './whats-new.mocks'

test.describe("What's new", () => {
	test('shows the current version in the sidebar', async ({
		page,
		whatsNewPage,
	}) => {
		await mockWhatsNewPage(page, LATEST_RELEASE)
		await whatsNewPage.goto()
		await expect(whatsNewPage.versionTrigger).toContainText(
			`v${LATEST_RELEASE}`,
		)
		await expect(whatsNewPage.unseenDot).toBeHidden()
	})

	test('highlights unseen notes and marks them as seen when opened', async ({
		page,
		whatsNewPage,
	}) => {
		const puts = await mockWhatsNewPage(page, null)
		await whatsNewPage.goto()
		await expect(whatsNewPage.unseenDot).toBeVisible()

		await whatsNewPage.openReleaseNotes()
		await expect(whatsNewPage.note(LATEST_RELEASE)).toBeVisible()
		await expect(whatsNewPage.newBadges).toHaveCount(1)
		await expect.poll(() => puts.length).toBe(1)
		expect(puts[0]?.postDataJSON()).toEqual({ version: LATEST_RELEASE })

		await whatsNewPage.closeReleaseNotes()
		await expect(whatsNewPage.unseenDot).toBeHidden()
		await page.reload()
		await expect(whatsNewPage.versionTrigger).toBeVisible()
		await expect(whatsNewPage.unseenDot).toBeHidden()
	})

	test('opens past notes without re-marking them when already seen', async ({
		page,
		whatsNewPage,
	}) => {
		const puts = await mockWhatsNewPage(page, LATEST_RELEASE)
		await whatsNewPage.goto()
		await whatsNewPage.openReleaseNotes()
		await expect(whatsNewPage.note(LATEST_RELEASE)).toBeVisible()
		await expect(whatsNewPage.newBadges).toHaveCount(0)
		expect(puts).toHaveLength(0)
	})
})
