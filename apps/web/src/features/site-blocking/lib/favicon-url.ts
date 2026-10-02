/** Google's favicon service — a 32px icon for any domain, no API key needed. */
export function faviconUrl(domain: string): string {
	return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`
}
