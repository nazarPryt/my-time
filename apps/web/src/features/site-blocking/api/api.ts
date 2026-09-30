import { api } from '@/shared/lib/api'

export async function fetchBlockedSites() {
	return api['site-blocking'].get()
}

export async function addBlockedSite(domain: string) {
	return api['site-blocking'].post({ domain })
}

export async function removeBlockedSite(id: string) {
	return api['site-blocking']({ id }).delete()
}

export async function generateExtensionToken() {
	return api.auth['extension-token'].post()
}
