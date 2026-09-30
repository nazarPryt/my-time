import { useState } from 'react'

const FAVICON_URL = (domain: string) =>
	`https://www.google.com/s2/favicons?domain=${domain}&sz=32`

export function useFavicon(domain: string) {
	const [failed, setFailed] = useState(false)

	return {
		src: failed ? null : FAVICON_URL(domain),
		onError: () => setFailed(true),
	}
}
