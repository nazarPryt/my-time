import GLib from 'gi://GLib'
import type { ApiClient } from './api-client'

/** The saved token identifies the queue offline; the API verifies its owner on upload. */
export function readAccountId(api: ApiClient): Promise<string> {
	return api.accountId((payload) =>
		new TextDecoder().decode(
			GLib.base64_decode(
				payload
					.replace(/-/g, '+')
					.replace(/_/g, '/')
					.padEnd(Math.ceil(payload.length / 4) * 4, '='),
			),
		),
	)
}
