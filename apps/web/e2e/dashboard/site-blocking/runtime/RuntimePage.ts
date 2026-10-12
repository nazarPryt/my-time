import { RuntimeLocators } from './runtime.locators'

export class RuntimePage extends RuntimeLocators {
	async login(extensionOrigin: string, email: string, password: string) {
		await this.page.goto(`${extensionOrigin}/popup.html`)
		await this.email.fill(email)
		await this.password.fill(password)
		await this.loginButton.click()
	}
	async connect(token: string, origin: string) {
		await this.page.goto(origin)
		return this.page.evaluate(
			({ token, origin }) =>
				new Promise<boolean>((resolve) => {
					const handler = (event: MessageEvent) => {
						if (
							event.origin === origin &&
							event.data?.type === 'MY_TIME_CONNECT_RESULT'
						) {
							window.removeEventListener('message', handler)
							resolve(event.data.success)
						}
					}
					window.addEventListener('message', handler)
					window.postMessage({ type: 'MY_TIME_CONNECT', token }, origin)
				}),
			{ token, origin },
		)
	}
}
