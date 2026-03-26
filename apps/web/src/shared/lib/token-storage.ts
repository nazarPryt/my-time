const ACCESS_TOKEN_KEY = 'access_token'

export const tokenStorage = {
	getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
	setAccessToken: (token: string) => {
		localStorage.setItem(ACCESS_TOKEN_KEY, token)
	},
	clear: () => {
		localStorage.removeItem(ACCESS_TOKEN_KEY)
	},
}
