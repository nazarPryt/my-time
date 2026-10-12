import { api } from '@/shared/lib/api'

export async function loadDesktopRequest(requestId: string) {
	const [request, account] = await Promise.all([
		api.auth['desktop-pairing'].info.post({ requestId }),
		api.auth.me.get(),
	])
	if (request.error || !request.data || account.error || !account.data)
		throw new Error(
			'This connection request is unavailable or expired. Start again from desktop Settings.',
		)
	return {
		confirmationCode: request.data.confirmationCode,
		email: account.data.email,
	}
}

export async function approveDesktopRequest(requestId: string) {
	const result = await api.auth['desktop-pairing'].approve.post({ requestId })
	if (result.error)
		throw new Error(
			'Unable to approve this connection. Start again from desktop Settings.',
		)
}
