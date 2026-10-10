import Gio from 'gi://Gio'
import Secret from 'gi://Secret?version=1'
import { ExchangeExtensionTokenResponseSchema } from 'contracts'
import { normalizeApiUrl } from '@/shared/urls'
import type { TokenStore, Tokens } from './api-client.js'

export class KeyringTokenStore implements TokenStore {
	private cancellable = new Gio.Cancellable()
	private schema = Secret.Schema.new(
		'org.gnome.shell.extensions.my-time',
		Secret.SchemaFlags.NONE,
		{
			'api-url': Secret.SchemaAttributeType.STRING,
		},
	)
	private attributes: Record<string, string>

	constructor(apiUrl: string) {
		this.attributes = { 'api-url': normalizeApiUrl(apiUrl) }
	}

	async load(): Promise<Tokens | null> {
		const secret = await new Promise<string | null>((resolve, reject) => {
			Secret.password_lookup(
				this.schema,
				this.attributes,
				this.cancellable,
				(_source, result) => {
					try {
						resolve(Secret.password_lookup_finish(result))
					} catch {
						reject(this.keyringError())
					}
				},
			)
		})
		if (!secret) return null
		try {
			return ExchangeExtensionTokenResponseSchema.parse(JSON.parse(secret))
		} catch {
			throw new Error(
				'Stored sign-in could not be read. Sign out and reconnect in Settings.',
			)
		}
	}

	save(tokens: Tokens): Promise<void> {
		return new Promise((resolve, reject) => {
			Secret.password_store(
				this.schema,
				this.attributes,
				Secret.COLLECTION_DEFAULT,
				'my-time desktop sign-in',
				JSON.stringify(tokens),
				this.cancellable,
				(_source, result) => {
					try {
						if (!Secret.password_store_finish(result)) throw this.keyringError()
						resolve()
					} catch {
						reject(this.keyringError())
					}
				},
			)
		})
	}

	clear(): Promise<void> {
		return new Promise((resolve, reject) => {
			Secret.password_clear(
				this.schema,
				this.attributes,
				this.cancellable,
				(_source, result) => {
					try {
						Secret.password_clear_finish(result)
						resolve()
					} catch {
						reject(this.keyringError())
					}
				},
			)
		})
	}

	dispose(): void {
		this.cancellable.cancel()
	}

	private keyringError(): Error {
		return new Error(
			'Cannot access the Linux keyring. Unlock it and try again.',
		)
	}
}
