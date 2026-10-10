import { type LoginRequest, LoginRequestSchema } from 'contracts'
import type { TokenStore } from '@/dal/api-client'
import type { ConnectionSettings, SettingsStore } from '@/dal/settings-store'
import { errorMessage } from '@/shared/errors'
import { normalizeApiUrl, normalizeUrl } from '@/shared/urls'

export interface AccountClient {
	login(credentials: LoginRequest): Promise<void>
	dispose(): void
}
export interface AccountServices {
	createClient(server: string): AccountClient
	createStorage(server: string): TokenStore
}
export interface SignInInput {
	apiUrl: string
	webUrl: string
	email: string
	password: string
}
export interface AccountState extends ConnectionSettings {
	busy: boolean
	status:
		| 'idle'
		| 'signing-in'
		| 'signed-in'
		| 'signing-out'
		| 'signed-out'
		| 'error'
	message: string
}

/** Account workflow exposes plain state; it never reads or mutates widgets. */
export class AccountController {
	state: AccountState
	private disposed = false
	private client: AccountClient | null = null
	private storage: TokenStore | null = null
	private unsubscribe: () => void
	constructor(
		private settings: SettingsStore,
		private services: AccountServices,
		private onChange: (state: AccountState) => void,
	) {
		this.state = {
			...settings.read(),
			busy: false,
			status: 'idle',
			message: '',
		}
		this.syncSettings()
		this.unsubscribe = settings.subscribe(() => this.syncSettings())
	}
	async signIn(input: SignInInput): Promise<void> {
		if (this.disposed || this.state.busy || this.state.connected) return
		this.update({ busy: true, status: 'signing-in', message: 'Signing in…' })
		try {
			const apiUrl = normalizeApiUrl(input.apiUrl)
			const webUrl = normalizeUrl(input.webUrl)
			const parsed = LoginRequestSchema.safeParse({
				email: input.email.trim(),
				password: input.password,
			})
			if (!parsed.success)
				throw new Error('Enter a valid email address and your password.')
			this.client = this.services.createClient(apiUrl)
			await this.client.login(parsed.data)
			if (this.disposed) return
			this.settings.connectAccount({ apiUrl, webUrl, email: parsed.data.email })
			this.update({
				...this.settings.read(),
				status: 'signed-in',
				message: `Connected as ${parsed.data.email}`,
			})
		} catch (error) {
			this.update({
				status: 'error',
				message: errorMessage(error, 'Unable to sign in. Try again.'),
			})
		} finally {
			this.client?.dispose()
			this.client = null
			this.update({ busy: false })
		}
	}
	async signOut(): Promise<void> {
		if (this.disposed || this.state.busy) return
		this.update({ busy: true, status: 'signing-out', message: 'Signing out…' })
		try {
			// Stop panel requests before clearing tokens so pending refresh cannot restore them.
			this.settings.disconnectAccount()
			this.update({ connected: false })
			this.storage = this.services.createStorage(this.settings.read().apiUrl)
			await this.storage.clear()
			if (this.disposed) return
			this.settings.clearAccount()
			this.update({
				...this.settings.read(),
				status: 'signed-out',
				message: 'Sign in to start tracking from the panel.',
			})
		} catch (error) {
			this.update({
				status: 'error',
				message: errorMessage(error, 'Unable to clear sign-in. Try again.'),
			})
		} finally {
			this.storage?.dispose()
			this.storage = null
			this.update({ busy: false })
		}
	}
	dispose(): void {
		this.disposed = true
		this.unsubscribe()
		this.client?.dispose()
		this.client = null
		this.storage?.dispose()
		this.storage = null
	}
	private syncSettings(): void {
		const connection = this.settings.read()
		this.update({
			...connection,
			...(!this.state.busy
				? {
						message: connection.connected
							? `Connected as ${connection.email}`
							: 'Sign in to start tracking from the panel.',
					}
				: {}),
		})
	}
	private update(next: Partial<AccountState>): void {
		if (this.disposed) return
		this.state = { ...this.state, ...next }
		this.onChange(this.state)
	}
}
