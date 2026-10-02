export const WEB_CONFIG = {
	API_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
	// Chrome Web Store listing. Leave unset until the extension is published —
	// the setup card then falls back to the manual "Load unpacked" guide.
	EXTENSION_STORE_URL: import.meta.env.VITE_EXTENSION_STORE_URL ?? '',
	// Zip of the built extension for the manual install path.
	EXTENSION_DOWNLOAD_URL:
		import.meta.env.VITE_EXTENSION_DOWNLOAD_URL ?? '/my-time-extension.zip',
} as const
