import {
	AUTH_ROUTES,
	DesktopPairingPollSchema,
	type DesktopPairingStart,
	DesktopPairingStartSchema,
} from 'contracts'
import type { HttpTransport, TokenStore } from './api-client'

export interface LoginDelay {
	wait(milliseconds: number): Promise<void>
	dispose(): void
}

/** Owns only the short-lived pairing exchange; session streaming stays separate. */
export class BrowserLogin {
	private disposed = false
	constructor(
		private transport: HttpTransport,
		private storage: TokenStore,
		private delay: LoginDelay,
	) {}

	async login(
		onRequest: (request: DesktopPairingStart) => Promise<void>,
	): Promise<string> {
		const start = await this.transport.send(
			'POST',
			`${AUTH_ROUTES.prefix}${AUTH_ROUTES.desktopPairingStart}`,
		)
		this.assertActive()
		if (start.status === 429)
			throw new Error('Wait a minute before trying again.')
		if (start.status !== 200)
			throw new Error('Unable to start browser sign-in. Try again.')
		const request = DesktopPairingStartSchema.parse(start.body)
		await onRequest(request)
		this.assertActive()
		let interval = request.interval
		for (
			let attempt = 0;
			attempt < Math.ceil(request.expiresIn / request.interval);
			attempt++
		) {
			await this.delay.wait(interval * 1000)
			this.assertActive()
			const response = await this.transport.send(
				'POST',
				`${AUTH_ROUTES.prefix}${AUTH_ROUTES.desktopPairingPoll}`,
				{
					requestId: request.requestId,
					deviceSecret: request.deviceSecret,
				},
			)
			this.assertActive()
			if (response.status !== 200)
				throw new Error('Browser sign-in failed. Try again.')
			const result = DesktopPairingPollSchema.parse(response.body)
			if (result.status === 'expired') break
			if (result.status === 'slow_down') interval += 5
			if (result.status !== 'connected') continue
			await this.storage.save(result.tokens)
			this.assertActive()
			return result.email
		}
		throw new Error('Browser sign-in expired. Try again from Settings.')
	}

	dispose(): void {
		this.disposed = true
		this.transport.dispose()
		this.storage.dispose()
		this.delay.dispose()
	}
	private assertActive(): void {
		if (this.disposed) throw new Error('Browser sign-in cancelled.')
	}
}
