import { test as base } from '../../support/dashboard.fixtures'
import { PermessoStatusPage } from './PermessoStatusPage'
import {
	mockPermessoHistory,
	mockPermessoStatus,
} from './permesso-status.mocks'
export const test = base.extend<{ permessoPage: PermessoStatusPage }>({
	permessoPage: async ({ page }, use) => {
		await mockPermessoStatus(page)
		await mockPermessoHistory(page)
		await use(new PermessoStatusPage(page))
	},
})
export { expect } from '@playwright/test'
