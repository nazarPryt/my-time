import { EXTENSION_VERSION } from 'contracts'
import { WEB_CONFIG } from '@/shared/config/web-config'

// The zip keeps the same filename across releases, so a cached copy could
// hand users the old version. Adding the version to the URL makes each
// release a distinct URL that no cache has seen yet.
export function extensionDownloadUrl(): string {
	const url = new URL(WEB_CONFIG.EXTENSION_DOWNLOAD_URL, window.location.origin)
	url.searchParams.set('v', EXTENSION_VERSION)
	return url.toString()
}
