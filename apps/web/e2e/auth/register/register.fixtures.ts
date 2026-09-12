import { test as base } from '@playwright/test'
import { RegisterPage } from './RegisterPage'

export const test = base.extend<{ registerPage: RegisterPage }>({
	registerPage: async ({ page }, use) => {
		await use(new RegisterPage(page))
	},
})

export { expect } from '@playwright/test'
