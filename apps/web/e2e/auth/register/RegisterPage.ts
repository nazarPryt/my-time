import { RegisterLocators } from './register.locators'

export const REGISTER_PATH = '/auth/register'

export class RegisterPage extends RegisterLocators {
	async goto() {
		await this.page.goto(REGISTER_PATH)
		await this.registerForm.waitFor({ state: 'visible' })
	}

	async fill(name: string, email: string, password: string) {
		await this.registerName.fill(name)
		await this.registerEmail.fill(email)
		await this.registerPassword.fill(password)
	}
}
