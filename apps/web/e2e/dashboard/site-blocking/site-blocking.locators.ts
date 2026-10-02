import type { Locator, Page } from '@playwright/test'
import { SITE_BLOCKING_TEST_IDS as SB } from '@/features/site-blocking/testIds'
import { BaseLocators } from '../BaseLocators'

export class SiteBlockingLocators extends BaseLocators {
	// Page shell
	readonly siteBlockingPage: Locator
	readonly statusBadge: Locator

	// Add form
	readonly domainInput: Locator
	readonly addBtn: Locator
	readonly error: Locator

	// Site list
	readonly listLoading: Locator
	readonly listEmpty: Locator
	readonly siteList: Locator
	readonly siteRows: Locator

	// Setup card
	readonly setupCard: Locator
	readonly installStep: Locator
	readonly connectStep: Locator
	readonly downloadLink: Locator
	readonly storeLink: Locator
	readonly reloadBtn: Locator
	readonly connectBtn: Locator
	readonly connectError: Locator

	// Update card
	readonly updateCard: Locator
	readonly updateDescription: Locator
	readonly updateDownloadLink: Locator

	// Sidebar — rendered by the dashboard shell, so it's unscoped (visible on every tab)
	readonly updateDot: Locator

	constructor(page: Page) {
		super(page)

		this.siteBlockingPage = page.getByTestId(SB.page)
		this.statusBadge = this.siteBlockingPage.getByTestId(SB.statusBadge)

		this.domainInput = this.siteBlockingPage.getByTestId(SB.domainInput)
		this.addBtn = this.siteBlockingPage.getByTestId(SB.addBtn)
		this.error = this.siteBlockingPage.getByTestId(SB.error)

		this.listLoading = this.siteBlockingPage.getByTestId(SB.listLoading)
		this.listEmpty = this.siteBlockingPage.getByTestId(SB.listEmpty)
		this.siteList = this.siteBlockingPage.getByTestId(SB.siteList)
		this.siteRows = this.siteList.getByTestId(SB.siteRow)

		this.setupCard = this.siteBlockingPage.getByTestId(SB.setupCard)
		this.installStep = this.setupCard.getByTestId(SB.installStep)
		this.connectStep = this.setupCard.getByTestId(SB.connectStep)
		this.downloadLink = this.installStep.getByTestId(SB.downloadLink)
		this.storeLink = this.installStep.getByTestId(SB.storeLink)
		this.reloadBtn = this.installStep.getByTestId(SB.reloadBtn)
		this.connectBtn = this.connectStep.getByTestId(SB.connectBtn)
		this.connectError = this.connectStep.getByTestId(SB.connectError)

		this.updateCard = this.siteBlockingPage.getByTestId(SB.updateCard)
		this.updateDescription = this.updateCard.getByTestId(SB.updateDescription)
		this.updateDownloadLink = this.updateCard.getByTestId(SB.updateDownloadLink)

		this.updateDot = page.getByTestId(SB.updateDot)
	}

	/** The nth blocked-site row (0-indexed), in render order. */
	siteRow(index: number) {
		return this.siteRows.nth(index)
	}

	siteDomain(index: number) {
		return this.siteRow(index).getByTestId(SB.siteDomain)
	}

	siteAddedAt(index: number) {
		return this.siteRow(index).getByTestId(SB.siteAddedAt)
	}

	siteFavicon(index: number) {
		return this.siteRow(index).getByTestId(SB.siteFavicon)
	}

	siteRemoveTrigger(index: number) {
		return this.siteRow(index).getByTestId(SB.siteRemoveTrigger)
	}

	/** "Done" marker next to a setup step's title. */
	stepDone(step: Locator) {
		return step.getByTestId(SB.stepDone)
	}

	/** The `chrome://extensions` copy chip inside a card. */
	copyableUrl(card: Locator) {
		return card.getByTestId(SB.copyableUrl)
	}

	copyableUrlCopied(card: Locator) {
		return this.copyableUrl(card).getByTestId(SB.copyableUrlCopied)
	}
}
