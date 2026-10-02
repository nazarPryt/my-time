import { useState } from 'react'
import { faviconUrl } from '../lib/favicon-url'

/** Favicon src for a domain, or `null` once it fails to load (hide the img). */
export function useFavicon(domain: string) {
	const [failed, setFailed] = useState(false)

	return {
		src: failed ? null : faviconUrl(domain),
		onError: () => setFailed(true),
	}
}
