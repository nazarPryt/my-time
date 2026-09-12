import { LoginLocators } from './login.locators'

export const LOGIN_PATH = '/auth/login'

export class LoginPage extends LoginLocators {
	async goto() {
		await this.page.goto(LOGIN_PATH)
		await this.loginForm.waitFor({ state: 'visible' })
	}

	async fill(email: string, password: string) {
		await this.loginEmail.fill(email)
		await this.loginPassword.fill(password)
	}
}
