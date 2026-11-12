export const AUTH_TEST_IDS = {
	login: {
		form: 'login-form',
		email: 'login-email',
		password: 'login-password',
		submit: 'login-submit',
		emailError: 'login-email-error',
		passwordError: 'login-password-error',
		registerLink: 'login-register-link',
	},
	register: {
		form: 'register-form',
		name: 'register-name',
		email: 'register-email',
		password: 'register-password',
		submit: 'register-submit',
		nameError: 'register-name-error',
		emailError: 'register-email-error',
		passwordError: 'register-password-error',
		loginLink: 'register-login-link',
	},
	signOutTrigger: 'sign-out-trigger',
} as const
