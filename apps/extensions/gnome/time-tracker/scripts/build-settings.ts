import { normalizeApiUrl, normalizeUrl } from '../src/shared/urls'

export function configureSchema(
	schema: string,
	env: Record<string, string | undefined>,
): string {
	const defaults = {
		'api-url': normalizeApiUrl(env.VITE_API_URL ?? 'http://localhost:3000'),
		'web-url': normalizeUrl(
			env.FRONTEND_WEB_URL ?? env.VITE_WEB_URL ?? 'http://localhost:5173',
		),
	}
	for (const [key, url] of Object.entries(defaults)) {
		// GVariant strings are nested inside XML text.
		const value = url
			.replace(/'/g, "\\'")
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
		schema = schema.replace(
			new RegExp(
				`(<key name="${key}" type="s">\\s*<default>)[\\s\\S]*?(</default>)`,
			),
			(_match, start, end) => `${start}'${value}'${end}`,
		)
	}
	return schema
}
