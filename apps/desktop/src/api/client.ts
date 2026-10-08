import {
	AUTH_ROUTES,
	type ExchangeExtensionTokenResponse,
	ExchangeExtensionTokenResponseSchema,
	type LoginRequest,
	LoginRequestSchema,
	type SessionResponse,
	SessionResponseSchema,
	TIME_TRACKER_ROUTES,
} from 'contracts'

export type Tokens = ExchangeExtensionTokenResponse

export interface TokenStore {
	load(): Promise<Tokens | null>
	save(tokens: Tokens): Promise<void>
	clear(): Promise<void>
	dispose(): void
}

export interface HttpResponse {
	status: number
	body: unknown
}

export interface HttpTransport {
	send(
		method: string,
		path: string,
		body?: unknown,
		accessToken?: string,
	): Promise<HttpResponse>
	dispose(): void
}

export class AuthenticationError extends Error {}

function requireSuccess(response: HttpResponse): unknown {
	if (response.status === 401)
		throw new AuthenticationError('Sign in to connect your account.')
	if (response.status < 200 || response.status >= 300) {
		throw new Error(`The API returned HTTP ${response.status}. Try again.`)
	}
	return response.body
}

export class ApiClient {
	private tokens: Tokens | null = null
	private refreshPromise: Promise<Tokens> | null = null
	private disposed = false

	constructor(
		private transport: HttpTransport,
		private storage: TokenStore,
	) {}

	async login(credentials: LoginRequest): Promise<void> {
		const body = LoginRequestSchema.parse(credentials)
		const response = await this.transport.send(
			'POST',
			`${AUTH_ROUTES.prefix}${AUTH_ROUTES.loginExtension}`,
			body,
		)
		if (response.status === 401)
			throw new AuthenticationError('Email or password is incorrect.')
		const tokens = ExchangeExtensionTokenResponseSchema.parse(
			requireSuccess(response),
		)
		this.assertActive()
		await this.storage.save(tokens)
		this.tokens = tokens
	}

	async getActive(): Promise<SessionResponse | null> {
		return SessionResponseSchema.nullable().parse(
			await this.request(
				'GET',
				`${TIME_TRACKER_ROUTES.prefix}${TIME_TRACKER_ROUTES.active}`,
			),
		)
	}

	async start(): Promise<SessionResponse> {
		return SessionResponseSchema.parse(
			await this.request(
				'POST',
				`${TIME_TRACKER_ROUTES.prefix}${TIME_TRACKER_ROUTES.start}`,
				{ type: 'work' },
			),
		)
	}

	async end(id: string): Promise<void> {
		const path = TIME_TRACKER_ROUTES.endById.replace(
			':id',
			encodeURIComponent(id),
		)
		SessionResponseSchema.nullable().parse(
			await this.request('PATCH', `${TIME_TRACKER_ROUTES.prefix}${path}`),
		)
	}

	dispose(): void {
		this.disposed = true
		this.tokens = null
		this.transport.dispose()
		this.storage.dispose()
	}

	private assertActive(): void {
		if (this.disposed) throw new Error('Connection closed.')
	}

	private async request(
		method: string,
		path: string,
		body?: unknown,
	): Promise<unknown> {
		this.assertActive()
		this.tokens ??= await this.storage.load()
		if (!this.tokens)
			throw new AuthenticationError('Sign in to connect your account.')
		const accessToken = this.tokens.accessToken
		let response = await this.transport.send(method, path, body, accessToken)
		this.assertActive()
		if (response.status === 401) {
			// Another request may already have rotated this access token.
			const tokens =
				this.tokens.accessToken !== accessToken
					? this.tokens
					: await this.refresh()
			response = await this.transport.send(
				method,
				path,
				body,
				tokens.accessToken,
			)
			this.assertActive()
		}
		return requireSuccess(response)
	}

	private async refresh(): Promise<Tokens> {
		if (this.refreshPromise) return this.refreshPromise
		this.refreshPromise = this.rotateTokens()
		try {
			return await this.refreshPromise
		} finally {
			this.refreshPromise = null
		}
	}

	private async rotateTokens(): Promise<Tokens> {
		const response = await this.transport.send(
			'POST',
			`${AUTH_ROUTES.prefix}${AUTH_ROUTES.refreshExtension}`,
			{ refreshToken: this.tokens?.refreshToken },
		)
		this.assertActive()
		if (response.status === 401) {
			this.tokens = null
			await this.storage.clear()
			throw new AuthenticationError(
				'Your sign-in expired. Open Settings to reconnect.',
			)
		}
		const tokens = ExchangeExtensionTokenResponseSchema.parse(
			requireSuccess(response),
		)
		await this.storage.save(tokens)
		this.assertActive()
		this.tokens = tokens
		return tokens
	}
}
