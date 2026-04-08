// Discriminated union for all extension messages.
// Every new feature adds its own message variants here — existing handlers
// are untouched because the switch exhausts on `type`.

export type ExtensionMessage =
	| { type: 'SYNC' }
	| { type: 'EXCHANGE_TOKEN'; token: string }

export type ExtensionResponse =
	| { type: 'SYNC'; count: number }
	| { type: 'EXCHANGE_TOKEN'; success: boolean }
