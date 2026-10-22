import { parseWebEnv } from './web-env'

const env = parseWebEnv(import.meta.env)

export const WEB_CONFIG = {
	API_URL: env.VITE_API_URL,
	// Chrome Web Store listing. Leave unset until the extension is published —
	// the setup card then falls back to the manual "Load unpacked" guide.
	EXTENSION_STORE_URL: env.VITE_EXTENSION_STORE_URL,
} as const
