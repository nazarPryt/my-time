const WEB_URL = import.meta.env.VITE_WEB_URL ?? 'http://localhost:5173'

export const EXTENSION_CONFIG = {
	API_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1',
	WEB_URL,
	SITE_BLOCKING_PAGE_URL: `${WEB_URL}/dashboard/site-blocking`,
} as const
